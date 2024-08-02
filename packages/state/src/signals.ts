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
  SignalStatus,
  SubscriptionMode,
  UseSchedule,
  SignalSubscription,
} from '@diax-js/common/state';
import { _getCurrentContext, getCurrentContext, useContext } from '@diax-js/context';
import { getActions, subscribe } from './support/subscribe';
import { ComputationAction, EffectAction, ScheduledAction } from './actions';
import { AsyncSupplier, Supplier } from '@diax-js/common';
import { useHost } from '@diax-js/context/host';
import { ScheduledError } from './support/errors';
import { Context } from '@diax-js/common/context';

type Then = Parameters<PromiseConstructor['prototype']['then']>;

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

class ScheduledSignal<T> implements ISignal<T> {
  #signal: ISignal<T>;
  #status: SignalStatus;
  #promise: Promise<unknown>;
  #resolve: Then[0];
  #reject: Then[1];

  constructor(signal: ISignal<T>, status: SignalStatus) {
    this.#signal = signal;
    this.#status = status;
    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  setValue(value: T): void {
    this.#signal.setValue(value);
  }

  get value() {
    const value = this.#signal?.value;
    if (this.#status === SignalStatus.WAITING) {
      throw new ScheduledError(this.#promise);
    }
    return value;
  }

  resolve(): void {
    this.#status = SignalStatus.RUNNING;
    this.#resolve?.(undefined);
  }

  reject(): void {
    this.#status = SignalStatus.RUNNING;
    this.#reject?.(undefined);
  }

  setSignal(signal: ISignal<T>) {
    this.#signal = signal;
  }
}

const produceEffectAction = (callable: VoidFunction) => new EffectAction(callable);
const produceComputationAction = (callable: VoidFunction) => new ComputationAction(callable);
const produceScheduledAction = (callable: VoidFunction) => new ScheduledAction(callable);

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
  const subscription = trySubscribe(fn, produceEffectAction, getCurrentContext());
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
  const subscription = trySubscribe(compute, produceComputationAction, getCurrentContext());
  const _scheduled = new ScheduledSignal(_signal!, subscription.status);
  if (subscription.status === SignalStatus.WAITING) {
    subscription.promise.then(
      () => {
        _scheduled.setSignal(_signal!);
        _scheduled.resolve();
      },
      () => {
        _scheduled.reject();
      },
    );
  }

  return new ComputedSignal(_scheduled, () => subscription.unsubscribe());
};

export const scheduled: UseSchedule = <T>(supplier: AsyncSupplier<T>) => {
  const _signal = signal(null) as Signal<T>;
  const _scheduled = new ScheduledSignal(_signal, SignalStatus.WAITING);
  const context = getCurrentContext();

  const setSignalValue = (value: T) => {
    useContext(context, () => {
      const previousSubscriptionMode = context.subscriptionMode;
      try {
        context.subscriptionMode = SubscriptionMode.SCHEDULED;
        _signal.setValue(value);
      } finally {
        context.subscriptionMode = previousSubscriptionMode;
      }
    });
  };

  const performSchedule = () => {
    supplier()
      .then(setSignalValue)
      .then(
        () => _scheduled.resolve(),
        () => _scheduled.reject,
      );
  };

  trySubscribe(performSchedule, produceScheduledAction, context);

  return _scheduled;
};

function trySubscribe(
  callable: VoidFunction,
  actionProvider: (callable: VoidFunction) => Action,
  context: Context,
): SignalSubscription & { status: SignalStatus; promise: Promise<unknown> } {
  let subscription: ReturnType<typeof subscribe> | null = null;
  let promise: Promise<unknown> = Promise.resolve();
  let status: SignalStatus = SignalStatus.RUNNING;
  try {
    subscription = subscribe(callable, produceEffectAction);
  } catch (error) {
    if (!(error instanceof ScheduledError)) {
      throw error;
    }
    status = SignalStatus.WAITING;
    promise = error.promise;
    error.promise.then(() => {
      useContext(context, () => {
        subscription = subscribe(callable, actionProvider);
      });
    });
  }
  return {
    unsubscribe() {
      subscription?.unsubscribe();
    },
    add(observable) {
      subscription?.add(observable);
    },
    status,
    promise,
  };
}
