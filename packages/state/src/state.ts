import { Context, SUBSCRIPTIONS, State, SubscriptionMode, Supplier, UseState } from '@diax-js/common';
import { getCurrentContext, useDocument, useSupplier } from '@diax-js/context';

let globalState: GlobalState;

class GlobalState {
  static {
    globalState = new GlobalState();
    useDocument(() => {
      useSupplier(GlobalState, () => globalState);
    });
  }

  private listeners = new Set<VoidFunction>();
  private execute = () => {
    if (this.listeners.size === 0) return;
    for (const lister of this.listeners) {
      try {
        lister();
      } catch (err) {
        setTimeout(() => {
          throw err;
        });
      }
    }
    this.listeners.clear();
  };

  scheduleExecute(subscriptions: Set<VoidFunction>): void {
    for (const subscription of subscriptions) {
      this.listeners.add(subscription);
    }
    queueMicrotask(this.execute);
  }
}

class StateImpl<T> implements State<T> {
  set value(value: T) {
    this.#value = value;
    globalState.scheduleExecute(this[SUBSCRIPTIONS]);
  }

  get value() {
    const context = this.getContext();
    if (context.subscriptionMode !== null) {
      context.observables.add(this);
    }
    return this.#value;
  }

  #value!: T;
  #owningContext: Context;
  private [SUBSCRIPTIONS]: Set<VoidFunction>;

  constructor(owningContext: Context) {
    this.#owningContext = owningContext;
    this[SUBSCRIPTIONS] = new Set();
  }

  private getContext() {
    try {
      return getCurrentContext();
    } catch (_err) {
      return this.#owningContext;
    }
  }
}

class ReadOnlyState<T> implements State<T> {
  get value() {
    return this.#state.value;
  }

  #state: State<T>;

  constructor(state: State<T>) {
    this.#state = state;
  }
}

export const useState: UseState = <T>(initialValue: T) => {
  const context = getCurrentContext();
  const state = new StateImpl<T>(context);
  state.value = initialValue;
  return state;
};

export const useEffect = (effectFn: VoidFunction) => {
  const context = getCurrentContext();
  const previousSubscriptionMode = context.subscriptionMode;
  context.observer = effectFn;
  context.subscriptionMode = SubscriptionMode.EFFECT;
  const observables = context.observables;
  const previousObservables = [...observables];
  const disposables: VoidFunction[] = [];
  observables.clear();
  try {
    effectFn();
    for (const observable of observables) {
      const subscriptions = Reflect.get(observable, SUBSCRIPTIONS) as Set<VoidFunction>;
      subscriptions.add(effectFn);
      disposables.push(() => {
        subscriptions.delete(effectFn);
      });
    }
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.observer = null;
    observables.clear();
    while (previousObservables.length) {
      observables.add(previousObservables.pop()!);
    }
  }
  return () => {
    for (const dispose of disposables) {
      dispose();
    }
  };
};

export const useComputed = <T>(supplier: Supplier<T>) => {
  let state: State<T> | null = null;
  useEffect(() => {
    if (!state) {
      state = useState(supplier());
    } else {
      state.value = supplier();
    }
  });
  return new ReadOnlyState(state!);
};
