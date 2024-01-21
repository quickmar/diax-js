import { Context, SUBSCRIPTIONS, State, StateHandler, SubscriptionMode, UseState, newStateID } from '@diax-js/common';
import { getCurrentContext, useDocument, useSupplier } from '@diax-js/context';

interface ContextStateHolder extends Record<number, { value: unknown; readonly [SUBSCRIPTIONS]: Set<VoidFunction> }> {}

class GlobalState implements Record<number, ContextStateHolder> {
  [contextId: number]: ContextStateHolder;

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

  defineContextRecord(contextId: number): void {
    if (!Object.hasOwn(this, contextId)) {
      this[contextId] = {};
    }
  }

  defineStateRecord(contextId: number, stateId: number): void {
    this.defineContextRecord(contextId);
    this[contextId];
    if (!Object.hasOwn(this[contextId], stateId)) {
      this[contextId][stateId] = { value: undefined, [SUBSCRIPTIONS]: new Set() };
    }
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

class StateImpl<T> implements State<T> {
  set value(value: T) {
    const stateHolder: GlobalState[0][0] = globalState[this.owningContextId][this.myIndex];
    stateHolder.value = value;
    const subscriptions = stateHolder[SUBSCRIPTIONS];
    for (const subscription of subscriptions) {
      globalState.addSubscription(subscription);
    }
    globalState.scheduleExecute();
  }

  get value() {
    const context = getContext(this.owningContext);
    if (context.subscriptionMode !== null) {
      context.observables.add(this);
    }
    const stateHolder: GlobalState[0][0] = globalState[this.owningContextId][this.myIndex];
    return stateHolder.value as T;
  }

  private owningContext: WeakRef<Context>;
  private owningContextId: number;
  private myIndex: number;

  constructor(owningContext: Context, myIndex: number) {
    this.owningContext = new WeakRef(owningContext);
    this.owningContextId = owningContext.contextId;
    this.myIndex = myIndex;
    globalState.defineStateRecord(this.owningContextId, this.myIndex);
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
  const disposables: VoidFunction[] = [];
  try {
    observables.clear();
    subscription();
    for (const observable of observables) {
      const myIndex: number = Reflect.get(observable, 'myIndex');
      const owningContextId: number = Reflect.get(observable, 'owningContextId');
      const stateHolder = globalState[owningContextId][myIndex];
      const subscriptions = stateHolder[SUBSCRIPTIONS];
      subscriptions.add(subscription);
      disposables.push(() => {
        subscriptions.delete(subscription);
      });
    }
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.observer = null;
    context.observables.clear();
    previousObservables.forEach(context.observables.add.bind(context.observables));
  }
  return () => {
    for (const dispose of disposables) {
      dispose();
    }
  };
};
