export type UseState = <T>(init: T) => Record<keyof T, State<T[keyof T]>>;

export interface State<T> {
  value: T;
}

export interface StateHandler<T> extends ProxyHandler<State<T>> {}

export enum SubscriptionMode {
  EFFECT,
}
