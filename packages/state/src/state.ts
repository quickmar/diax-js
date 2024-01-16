
import { getCurrentContext, useDocument, useSupplier } from '@diax-js/context';

export const useState = (initialValue: object) => {return new State(initialValue, null)};

class GlobalState extends EventTarget implements Record<number, object> {
  [x: number]: object;
}

const globalState = new GlobalState();
useDocument(() => {
  useSupplier(GlobalState, () => globalState);
});

export class State implements ProxyHandler<object> {
  private readonly parentState: WeakRef<State> | null;
  private readonly owningContextID = getCurrentContext().contextId;
  private readonly myIndex = 3;
  private readonly globalState: WeakRef<GlobalState>;

  set value(value: unknown) {
    const state = this.globalState.deref()?.[this.owningContextID];
    Reflect.set(state!, this.myIndex, value);
  }

  get value() {
    const state = this.globalState.deref()?.[this.owningContextID];
    return Reflect.get(state!, this.myIndex);
  }

  constructor(initialValue: unknown, parentState: State | null) {
    this.parentState = parentState ? new WeakRef(parentState) : null;
    this.globalState = new WeakRef(globalState);
    globalState[this.owningContextID] = { [this.myIndex]: initialValue };
    return new Proxy(this, this);
  }

  get(target: this, property: string | symbol, receiver: unknown) {
    if (!Reflect.has(target, property)) {
      Reflect.set(target, property, new State(undefined, this), receiver);
    }
    return Reflect.get(target, property, receiver);
  }

  set(target: this, property: string | symbol, newValue: unknown, receiver: unknown): boolean {
    if (!Reflect.has(target, property)) {
      Reflect.set(target, property, new State(newValue, this), receiver);
    }
    const childState = Reflect.get(target, property, receiver) as State;
    childState.value = newValue;
    return true;
  }
}
