export type UseState = <T>(init: T) => State<T>;

export interface State<T> {
  value: T;
}

export enum SubscriptionMode {
  SUBSCRIPTION,
  EFFECT,
  COMPUTED,
}

export const SUBSCRIPTIONS = Symbol.for('@@subscriptions');
