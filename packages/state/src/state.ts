import { Context, SUBSCRIPTIONS, State, StateHandler, SubscriptionMode, UseState } from '@diax-js/common';
import { getCurrentContext, useDocument, useSupplier } from '@diax-js/context';

let globalState: GlobalState;

const getContext = (myContext: WeakRef<Context>) => {
  try {
    return getCurrentContext();
  } catch (err) {
    const context = myContext.deref();
    if (context) {
      return context;
    }
    throw err;
  }
};

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

class StateHandlerImpl<T> implements StateHandler<T> {
  get(target: State<T>, property: string | symbol, receiver: unknown) {
    if (!Reflect.has(target, property)) {
      Reflect.set(target, property, new StateImpl(getCurrentContext()), receiver);
    }
    return Reflect.get(target, property, receiver);
  }

  set(target: State<T>, property: string | symbol, newValue: T, receiver: StateHandler<T>): boolean {
    let stateToUpdate: State<unknown> | null = null;
    if (!Reflect.has(target, property)) {
      stateToUpdate = new StateImpl(getCurrentContext());
      Reflect.set(target, property, stateToUpdate, receiver);
    } else {
      stateToUpdate = Reflect.get(target, property, receiver) as State<T>;
    }
    stateToUpdate.value = newValue;
    return true;
  }
}

class StateImpl<T> implements State<T> {
  set value(value: T) {
    this.#value = value;
    globalState.scheduleExecute(this[SUBSCRIPTIONS]);
  }

  get value() {
    const context = getContext(this.owningContext);
    if (context.subscriptionMode !== null) {
      context.observables.add(this);
    }
    return this.#value;
  }

  #value!: T;
  private owningContext: WeakRef<Context>;
  private [SUBSCRIPTIONS]: Set<VoidFunction>;

  constructor(owningContext: Context) {
    this.owningContext = new WeakRef(owningContext);
    this[SUBSCRIPTIONS] = new Set();
  }
}

export const useState: UseState = <T>(initialValue: T) => {
  const context = getCurrentContext();
  const state = new StateImpl<T>(context);
  const proxy = new Proxy(state, new StateHandlerImpl());
  Object.assign(proxy, initialValue);
  return proxy as unknown as Record<PropertyKey, State<T[keyof T]>>;
};

export const useEffect = (subscription: VoidFunction) => {
  const context = getCurrentContext();
  const previousSubscriptionMode = context.subscriptionMode;
  context.observer = subscription;
  context.subscriptionMode = SubscriptionMode.EFFECT;
  const observables = context.observables;
  const previousObservables = [...observables];
  const disposables: VoidFunction[] = [];
  try {
    observables.clear();
    subscription();
    for (const observable of observables) {
      const subscriptions = Reflect.get(observable, SUBSCRIPTIONS) as Set<VoidFunction>;
      subscriptions.add(subscription);
      disposables.push(() => {
        subscriptions.delete(subscription);
      });
    }
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.observer = null;
    observables.clear();
    for (const observable of previousObservables) {
      observables.add(observable);
    }
  }
  return () => {
    for (const dispose of disposables) {
      dispose();
    }
  };
};
