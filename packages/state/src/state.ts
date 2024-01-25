import { SUBSCRIPTIONS, State, Subscription, SubscriptionMode, Supplier, UseState } from '@diax-js/common';
import { useContext, _getCurrentContext, getCurrentContext } from '@diax-js/context';
import { ComputationSubscription, EffectSubscription } from './subscription';

const getSubscription = (state: State<unknown>) => Reflect.get(state, SUBSCRIPTIONS) as Set<Subscription>;

class StateImpl<T> implements State<T> {
  #value!: T;
  #subscriptions: Set<Subscription> = new Set();

  set value(value: T) {
    this.#value = value;
    for (const subscription of this.#subscriptions) {
      subscription.schedule();
    }
  }

  get value() {
    const context = _getCurrentContext();
    if (context && context.subscriptionMode !== null) {
      context.observables.add(this);
    }
    return this.#value;
  }

  private get [SUBSCRIPTIONS]() {
    return this.#subscriptions;
  }
}

class ComputedState<T> implements State<T> {
  #state: State<T>;
  #dispose: VoidFunction;
  private isCleared = false;

  get value() {
    return this.#state.value;
  }

  constructor(state: State<T>, dispose: VoidFunction) {
    this.#state = state;
    this.#dispose = dispose;
  }

  dispose(): void {
    if (!this.isCleared) {
      this.#dispose();
      this.#dispose = () => {};
      this.isCleared = true;
    }
  }
}

export const useState: UseState = <T>(initialValue: T) => {
  const state = new StateImpl<T>();
  state.value = initialValue;
  return state;
};

const useEffectInternal_ = (fn: VoidFunction, subscriptionMode: SubscriptionMode) => {
  const context = getCurrentContext();
  const effectFn = () => {
    useContext(context, fn);
  };

  const subscription =
    subscriptionMode === SubscriptionMode.EFFECT
      ? new EffectSubscription(effectFn)
      : new ComputationSubscription(effectFn);
  const previousSubscriptionMode = context.subscriptionMode;
  const previousObservables = context.observables;
  context.subscriptionMode = subscriptionMode;
  context.observables = new Set();
  const disposables: VoidFunction[] = [];
  try {
    effectFn();
    for (const observable of context.observables) {
      const subscriptions = getSubscription(observable);
      subscriptions.add(subscription);
      disposables.push(() => {
        subscriptions.delete(subscription);
        subscription.clear();
      });
    }
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.observables = previousObservables;
  }
  return () => {
    while (disposables.length) {
      disposables.pop()?.();
    }
  };
};

export const useEffect = (fn: VoidFunction) => {
  return useEffectInternal_(fn, SubscriptionMode.EFFECT);
};

export const useComputed = <T>(supplier: Supplier<T>) => {
  let state: State<T> | null = null;
  const compute = () => {
    if (state) {
      const value = supplier();
      if (state.value !== value) {
        state.value = value;
      }
    } else {
      state = useState(supplier());
    }
  };
  const dispose = useEffectInternal_(compute, SubscriptionMode.COMPUTED);
  return new ComputedState(state!, dispose);
};
