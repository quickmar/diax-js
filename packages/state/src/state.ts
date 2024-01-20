import { Context, State, StateHandler, SubscriptionMode, UseState, newStateID } from '@diax-js/common';
import { getCurrentContext, useDocument, useSupplier } from '@diax-js/context';

interface StateEventInit<T> extends EventInit {
  previousState: T;
  contextId: number;
  stateId: number;
}

class StateEvent<T> extends Event implements StateEventInit<T> {
  previousState: T;
  contextId: number;
  stateId: number;
  constructor(eventInitDict: StateEventInit<T>) {
    super('state', eventInitDict);
    this.previousState = eventInitDict.previousState;
    this.contextId = eventInitDict.contextId;
    this.stateId = eventInitDict.stateId;
  }
}

class GlobalState implements Record<number, object> {
  [x: number]: Record<number, unknown>;
  readonly eventBus: EventTarget = new EventTarget();
  readonly listeners = new Set<VoidFunction>();
  readonly stateListeners = new Map<number, Set<VoidFunction>>();

  constructor() {
    const execute = () => {
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
    this.eventBus.addEventListener('state', (e) => {
      const { stateId } = e as StateEvent<unknown>;
      for (const lister of this.stateListeners.get(stateId) ?? []) {
        this.listeners.add(lister);
      }
      queueMicrotask(execute);
    });
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
    const previousValue = state[this.myIndex];
    state[this.myIndex] = value;
    globalState.eventBus.dispatchEvent(
      new StateEvent({
        contextId: this.owningContextId,
        stateId: this.myIndex,
        previousState: previousValue,
      }),
    );
  }
  get value() {
    const context = getContext(this.owningContext);
    if (context.subscriptionMode !== null) {
      let listeners = globalState.stateListeners.get(this.myIndex);
      if (!listeners) {
        listeners = new Set();
        globalState.stateListeners.set(this.myIndex, listeners);
      }
      const subscription = context.subscription!;
      listeners.add(subscription);
      context.disposables.add(() => {
        listeners?.delete(subscription);
      });
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
  context.subscriptionMode = SubscriptionMode.EFFECT;
  context.subscription = subscription;
  try {
    subscription();
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.subscription = null;
  }
  const disposables = [...context.disposables];
  context.disposables.clear();
  return () => {
    for (const disposable of disposables) {
      disposable();
    }
    disposables.length = 0;
  };
};
