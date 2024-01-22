export type UseState = <T>(init: T) => State<T>;

export interface State<T> {
  value: T;
}

export enum SubscriptionMode {
  EFFECT,
}

export const SUBSCRIPTIONS = Symbol.for('@@subscriptions');
