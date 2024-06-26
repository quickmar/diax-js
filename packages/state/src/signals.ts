import {
  ACTIONS,
  Signal as ISignal,
  Action,
  UseSignal,
  ComputedSignal as IComputedSignal,
  UseComputed,
  UseEffect,
  UseAttribute,
  AttributeSignal as IAttributeSignal,
} from '@diax-js/common/state';
import { _getCurrentContext, getCurrentContext } from '@diax-js/context';
import { getActions, subscribe } from './support/subscribe';
import { ComputationAction, EffectAction } from './actions';
import { Supplier } from '@diax-js/common';
import { useHost } from '@diax-js/context/host';

class Signal<T> implements ISignal<T> {
  #value!: T;
  #actions: Set<Action> = new Set();

  setValue(value: T) {
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

class AttributeSignal implements IAttributeSignal {
  #signal: ISignal<string>;
  #host: HTMLElement;
  #qualifiedName: string;

  get value() {
    return this.#signal.value;
  }

  setValue(value: string) {
    this.#host.setAttribute(this.#qualifiedName, value);
  }

  constructor(signal: ISignal<string>, qualifiedName: string) {
    this.#signal = signal;
    this.#host = useHost();
    this.#qualifiedName = qualifiedName;
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

export const attribute: UseAttribute = (attribute: string) => {
  const { attributes, host, observedAttributes } = getCurrentContext();

  if (!observedAttributes.has(attribute)) {
    throw new ReferenceError(
      `${host.localName} has no attribute '${attribute}' in 'observedAttributes' static property.`,
    );
  }
  let attributeSignal = attributes[attribute];
  if (attributeSignal === null) {
    attributeSignal = signal(host.getAttribute(attribute) ?? '');
    attributes[attribute] = attributeSignal;
    return new AttributeSignal(attributeSignal, attribute);
  } else {
    return new AttributeSignal(attributeSignal, attribute);
  }
};

export const signal: UseSignal = <T>(initialValue: T) => {
  const state = new Signal<T>();
  state.setValue(initialValue);
  return state;
};

export const effect: UseEffect = (fn: VoidFunction) => {
  const subscription = subscribe(fn, produceEffectAction);
  return () => subscription.unsubscribe();
};

export const computed: UseComputed = <T>(supplier: Supplier<T>) => {
  let _signal: ISignal<T> | null = null;
  const compute = () => {
    if (_signal) {
      _signal.setValue(supplier());
    } else {
      _signal = signal(supplier());
    }
  };
  const subscription = subscribe(compute, produceComputationAction);
  return new ComputedSignal(_signal!, () => subscription.unsubscribe());
};
