import { Supplier } from '../model/common';

export type UseSignal = <T>(init: T) => Signal<T>;
export type UseComputed = <T>(supplier: Supplier<T>) => ComputedSignal<T>;
export type UseEffect = (fn: VoidFunction) => VoidFunction;

export interface Signal<T> {
  value: T;
}

export interface ReadonlySignal<T> extends Signal<T> {
  readonly value: T;
}

export interface ComputedSignal<T> extends ReadonlySignal<T>, Subscription {}

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

export interface ActionProcessor<T extends Action> {
  process(action: T): void;
}

export const ACTIONS = Symbol.for('@@actions');
