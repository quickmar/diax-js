import { ACTIONS, Action, Signal, SignalSubscription as ISignalSubscription } from '@diax-js/common/state';
import { getCurrentContext, useContext } from '@diax-js/context';

export const getActions = (state: Signal<unknown>) => Reflect.get(state, ACTIONS) as Set<Action>;

class SignalSubscription implements ISignalSubscription {
  private signals: Set<Signal<unknown>> = new Set();
  private closed = false;

  constructor(private readonly action: Action) {}

  add(containsAction: Signal<unknown>): void {
    this.signals.add(containsAction);
  }

  unsubscribe(): void {
    if (this.closed) return;
    for (const signal of this.signals) {
      getActions(signal).delete(this.action);
    }
    this.signals.clear();
    Object.assign(this, { action: null, closed: true });
  }
}

export const subscribe = <T extends Action>(fn: VoidFunction, actionProvider: (callable: VoidFunction) => T) => {
  const context = getCurrentContext();
  const callable = () => {
    useContext(context, fn);
  };

  const action = actionProvider(callable);
  const subscription = new SignalSubscription(action);
  const previousSubscriptionMode = context.subscriptionMode;
  const previousObservables = context.observables;
  context.subscriptionMode = action.subscriptionMode;
  context.observables = new Set();
  try {
    callable();
    for (const observable of context.observables) {
      const actions = getActions(observable);
      actions.add(action);
      subscription.add(observable);
    }
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.observables = previousObservables;
    context.ownedSubscriptions.add(subscription);
  }
  return subscription;
};
