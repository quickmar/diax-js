import {
  ACTIONS,
  Signal as ISignal,
  Action,
  SubscriptionMode,
  Supplier,
  UseSignal,
  ComputedSignal as IComputedSignal,
  Subscription,
  UseComputed,
  UseEffect,
} from '@diax-js/common';
import { useContext, _getCurrentContext, getCurrentContext } from '@diax-js/context';
import { ComputationAction, EffectAction } from './actions';

const getActions = (state: ISignal<unknown>) => Reflect.get(state, ACTIONS) as Set<Action>;

class Signal<T> implements ISignal<T> {
  #value!: T;
  #actions: Set<Action> = new Set();

  set value(value: T) {
    this.#value = value;
    for (const action of this.#actions) {
      action.schedule();
    }
  }

  get value() {
    const context = _getCurrentContext();
    if (context && context.subscriptionMode !== null) {
      context.observables.add(this);
    }
    return this.#value;
  }

  private get [ACTIONS]() {
    return this.#actions;
  }
}

class ComputedSignal<T> implements IComputedSignal<T> {
  #signal: ISignal<T>;
  #dispose: VoidFunction;
  private close = false;

  get value() {
    return this.#signal.value;
  }

  constructor(state: ISignal<T>, dispose: VoidFunction) {
    this.#signal = state;
    this.#dispose = dispose;
  }

  unsubscribe(): void {
    if (!this.close) {
      this.#dispose();
      getActions(this.#signal).clear();
      this.#dispose = () => {};
      this.close = true;
    }
  }
}

const subscribe_ = (fn: VoidFunction, subscriptionMode: SubscriptionMode) => {
  const context = getCurrentContext();
  const callable = () => {
    useContext(context, fn);
  };

  const action =
    subscriptionMode === SubscriptionMode.EFFECT ? new EffectAction(callable) : new ComputationAction(callable);
  const previousSubscriptionMode = context.subscriptionMode;
  const previousObservables = context.observables;
  context.subscriptionMode = subscriptionMode;
  context.observables = new Set();
  const disposables: Subscription[] = [];
  try {
    callable();
    for (const observable of context.observables) {
      const actions = getActions(observable);
      actions.add(action);
      const subscription = {
        actions,
        action,
        unsubscribe() {
          this.actions.delete(this.action);
          this.action.unsubscribe();
          Object.assign(this, { action: null, actions: null });
        },
      };
      disposables.push(subscription);
    }
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.observables = previousObservables;
  }
  return () => {
    while (disposables.length) {
      disposables.pop()?.unsubscribe();
    }
  };
};

export const signal: UseSignal = <T>(initialValue: T) => {
  const state = new Signal<T>();
  state.value = initialValue;
  return state;
};

export const useEffect: UseEffect = (fn: VoidFunction) => {
  return subscribe_(fn, SubscriptionMode.EFFECT);
};

export const computed: UseComputed = <T>(supplier: Supplier<T>) => {
  let _signal: ISignal<T> | null = null;
  const compute = () => {
    if (_signal) {
      const value = supplier();
      if (_signal.value !== value) {
        _signal.value = value;
      }
    } else {
      _signal = signal(supplier());
    }
  };
  const dispose = subscribe_(compute, SubscriptionMode.COMPUTED);
  return new ComputedSignal(_signal!, dispose);
};
