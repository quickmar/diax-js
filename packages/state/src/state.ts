import { SUBSCRIPTIONS, State, SubscriptionMode, Supplier, UseState } from '@diax-js/common';
import { useContext, useDocument, useSupplier, _getCurrentContext, getCurrentContext } from '@diax-js/context';

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

  scheduleExecute(subscriptions: Iterable<VoidFunction>): void {
    for (const subscription of subscriptions) {
      this.listeners.add(subscription);
    }
    queueMicrotask(this.execute);
  }
}

class StateImpl<T> implements State<T> {
  #value!: T;
  #subscriptions: Set<VoidFunction> = new Set();

  set value(value: T) {
    this.#value = value;
    globalState.scheduleExecute(this[SUBSCRIPTIONS]);
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

  get value() {
    return this.#state.value;
  }

  constructor(state: State<T>, dispose: VoidFunction) {
    this.#state = state;
    this.#dispose = dispose;
  }

  dispose(): void {
    this.#dispose();
  }
}

export const useState: UseState = <T>(initialValue: T) => {
  const state = new StateImpl<T>();
  state.value = initialValue;
  return state;
};

export const useEffect = (fn: VoidFunction) => {
  const context = getCurrentContext();
  const effectFn = () => {
    useContext(context, fn);
  };
  context.observer = effectFn; //TODO: REMOVE
  context.subscriptionMode = SubscriptionMode.SUBSCRIPTION;
  const previousSubscriptionMode = context.subscriptionMode;
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
    while (disposables.length) {
      disposables.pop()?.();
    }
  };
};

export const useComputed = <T>(supplier: Supplier<T>) => {
  let state: State<T> | null = null;
  const compute = () => {
    const value = supplier();
    if (state!.value !== value) {
      state!.value = value;
    }
  };
  const dispose = useEffect(() => {
    if (!state) {
      state = useState(supplier());
    } else {
      globalState.scheduleExecute([compute]);
    }
  });
  return new ComputedState(state!, dispose);
};
