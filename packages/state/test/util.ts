import { ACTIONS, Action, Signal } from '@diax-js/common/state';

export function getActions(signal: Signal<unknown>): Set<Action> {
  return Reflect.get(signal, ACTIONS);
}

export function getFirstAction(sig: Signal<unknown>): Action {
  return [...getActions(sig)][0];
}
