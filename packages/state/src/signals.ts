import {
  ACTIONS,
  Signal as ISignal,
  Action,
  Supplier,
  UseSignal,
  ComputedSignal as IComputedSignal,
  UseComputed,
  UseEffect,
} from '@diax-js/common';
import { _getCurrentContext } from '@diax-js/context';
import { getActions, subscribe } from './support/subscribe';
import { ComputationAction, EffectAction } from './actions';

class Signal<T> implements ISignal<T> {
  #value!: T;
  #actions: Set<Action> = new Set();

  set value(value: T) {
    if (this.#value === value) return;
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

const produceEffectAction = (callable: VoidFunction) => new EffectAction(callable);
const produceComputationAction = (callable: VoidFunction) => new ComputationAction(callable);

export const signal: UseSignal = <T>(initialValue: T) => {
  const state = new Signal<T>();
  state.value = initialValue;
  return state;
};

export const useEffect: UseEffect = (fn: VoidFunction) => {
  const subscription = subscribe(fn, produceEffectAction);
  return () => subscription.unsubscribe();
};

export const computed: UseComputed = <T>(supplier: Supplier<T>) => {
  let _signal: ISignal<T> | null = null;
  const compute = () => {
    if (_signal) {
      _signal.value = supplier();
    } else {
      _signal = signal(supplier());
    }
  };
  const subscription = subscribe(compute, produceComputationAction);
  return new ComputedSignal(_signal!, () => subscription.unsubscribe());
};
