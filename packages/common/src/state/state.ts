export type UseState = <T>(init: T) => State<T>;

export interface State<T> {
  value: T;
}

export enum SubscriptionMode {
  EFFECT,
  COMPUTED,
}

export interface Subscription {
  readonly subscriptionMode: SubscriptionMode;
  readonly callable: VoidFunction;

  clear(): void;
  schedule(): void;
}

export interface StateQueue<T extends Subscription> {
  schedule(subscription: T): void;
}

export const SUBSCRIPTIONS = Symbol.for('@@subscriptions');
