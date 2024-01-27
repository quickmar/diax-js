import { Supplier } from '../model/common';

export type UseSignal = <T>(init: T) => Signal<T>;
export type UseComputed = <T>(supplier: Supplier<T>) => ReadonlySignal<T>;
export type UseEffect = (fn: VoidFunction) => void;

export interface Signal<T> {
  value: T;
}

export interface ReadonlySignal<T> extends Signal<T>, Subscription {
  readonly value: T;
}

export enum SubscriptionMode {
  EFFECT,
  COMPUTED,
}

export interface Action extends Subscription {
  readonly subscriptionMode: SubscriptionMode;
  readonly call: VoidFunction;

  schedule(): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface ActionQueue<T extends Action> {
  schedule(action: T): void;
}

export const ACTIONS = Symbol.for('@@actions');
