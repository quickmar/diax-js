import { Subscription, ACTIONS, Action, Signal } from '@diax-js/common';
import { getCurrentContext, useContext } from '@diax-js/context';

export const getActions = (state: Signal<unknown>) => Reflect.get(state, ACTIONS) as Set<Action>;

export const subscribe = <T extends Action>(fn: VoidFunction, actionProvider: (callable: VoidFunction) => T) => {
  const context = getCurrentContext();
  const callable = () => {
    useContext(context, fn);
  };

  const action = actionProvider(callable);
  const previousSubscriptionMode = context.subscriptionMode;
  const previousObservables = context.observables;
  context.subscriptionMode = action.subscriptionMode;
  context.observables = new Set();
  const disposables: Subscription[] = [];
  try {
    callable();
    for (const observable of context.observables) {
      const actions = getActions(observable);
      actions.add(action);
      const subscription = {
        actions,
        action,
        unsubscribe() {
          this.actions.delete(this.action);
          this.action.unsubscribe();
          Object.assign(this, { action: null, actions: null });
        },
      };
      disposables.push(subscription);
    }
  } finally {
    context.subscriptionMode = previousSubscriptionMode;
    context.observables = previousObservables;
  }
  return () => {
    while (disposables.length) {
      disposables.pop()?.unsubscribe();
    }
  };
};
