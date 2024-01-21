import { Context, SUBSCRIPTIONS, State, StateHandler, SubscriptionMode, UseState, newStateID } from '@diax-js/common';
import { getCurrentContext, useDocument, useSupplier } from '@diax-js/context';

class GlobalState implements Record<number, object> {
  [x: number]: Record<number, unknown>;
  readonly eventBus: EventTarget = new EventTarget();
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

  constructor() {}

  scheduleExecute(): void {
    queueMicrotask(this.execute);
  }

  addSubscription(subscription: VoidFunction): void {
    this.listeners.add(subscription);
  }
}

const globalState = new GlobalState();
useDocument(() => {
  useSupplier(GlobalState, () => globalState);
});

class StateHandlerImpl<T> implements StateHandler<T> {
  readonly owningContext: WeakRef<Context>;
  readonly owningContextID: number;
  readonly myIndex;

  constructor(owningContext: Context, myIndex: number) {
    this.owningContext = new WeakRef(owningContext);
    this.owningContextID = owningContext.contextId;
    this.myIndex = myIndex;
    !Object.hasOwn(globalState, this.owningContextID) && (globalState[this.owningContextID] = {});
  }
  get(target: State<T>, property: string | symbol, receiver: unknown) {
    if (!Reflect.has(target, property)) {
      Reflect.set(target, property, new StateImpl(getCurrentContext(), newStateID()), receiver);
    }
    return Reflect.get(target, property, receiver);
  }

  set(target: State<T>, property: string | symbol, newValue: T, receiver: StateHandler<T>): boolean {
    let stateToUpdate: State<unknown> | null = null;
    if (!Reflect.has(target, property)) {
      const childStateIndex = newStateID();
      stateToUpdate = new StateImpl(getCurrentContext(), childStateIndex);
      Reflect.set(target, property, stateToUpdate, receiver);
    } else {
      stateToUpdate = Reflect.get(target, property, receiver) as State<T>;
    }
    stateToUpdate.value = newValue;
    return true;
  }
}

const getContext = (myContext: Context) => {
  try {
    return getCurrentContext();
  } catch (_err) {
    return myContext;
  }
};

class StateImpl<T> implements State<T> {
  set value(value: T) {
    const state: GlobalState[0] = globalState[this.owningContextId];
    state[this.myIndex] = value;
    const subscriptions = Reflect.get(this, SUBSCRIPTIONS) as Set<VoidFunction>;
    if (subscriptions) {
      for (const subscription of subscriptions) {
        globalState.addSubscription(subscription);
      }
      globalState.scheduleExecute();
    }
  }
  get value() {
    const context = getContext(this.owningContext);
    if (context.subscriptionMode !== null) {
      context.observables.add(this);
    }
    const state: GlobalState[0] = globalState[this.owningContextId];
    return state[this.myIndex] as T;
  }

  private owningContext: Context;
  private owningContextId: number;
  private myIndex: number;

  constructor(owningContext: Context, myIndex: number) {
    this.owningContext = owningContext;
    this.owningContextId = owningContext.contextId;
    this.myIndex = myIndex;
  }
}

export const useState: UseState = <T>(initialValue: T) => {
  const context = getCurrentContext();
  const stateId = newStateID();
  const state = new StateImpl<T>(context, stateId);
  const proxy = new Proxy(state, new StateHandlerImpl(context, stateId));
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
  let currentObservables: State<unknown>[] = [];
  try {
    observables.clear();
    subscription();
    currentObservables = [...observables];
    for (const observable of currentObservables) {
      let subscriptions: Set<VoidFunction> = Reflect.get(observable, SUBSCRIPTIONS);
      if (!subscriptions) {
        subscriptions = new Set();
        Reflect.set(observable, SUBSCRIPTIONS, subscriptions);
      }
      subscriptions.add(subscription);
    }
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.observer = null;
    context.observables.clear();
    previousObservables.forEach(context.observables.add.bind(context.observables));
  }
  return () => {
    for (const observable of currentObservables) {
      const subscriptions: Set<VoidFunction> = Reflect.get(observable, SUBSCRIPTIONS);
      subscriptions.delete(subscription);
    }
  };
};
