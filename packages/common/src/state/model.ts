import { Lockable } from '../concurrent/model';
import { Supplier } from '../model/common';
/**
 * UseSignal is a factory that returns {@link Signal}
 */
export type UseSignal = <T>(init: T) => Signal<T>;

/**
 * UseAttribute is a factory that returns {@link AttributeSignal}
 */
export type UseAttribute = (attribute: string) => AttributeSignal;

/**
 * UseComputed is a factory that takes {@link Supplier} and returns {@link ComputedSignal}.
 */
export type UseComputed = <T>(supplier: Supplier<T>) => ComputedSignal<T>;

/**
 * UseEffect is a function that takes {@link VoidFunction} and re-run it whenever dependent {@link Signal}'s has changed.
 */
export type UseEffect = (fn: VoidFunction) => VoidFunction;

/**
 * Signal is a reactive value.
 * It can be updated by calling setValue.
 * It can be observed by getting it value inside of {@link useContext} function or it derivatives.
 * It dependencies will be updated automatically.
 */
export interface Signal<T> extends ReadonlySignal<T> {
  setValue(value: T): void;
}

/**
 * ReadonlySignal is a {@link Signal} that can be observed.
 */
export interface ReadonlySignal<T> {
  readonly value: T;
}

/**
 * AttributeSignal is a {@link Signal} that can be observed and updated from attribute.
 * To work with AttributeSignal you need to use define name of the attribute inside observedAttributes static property.
 *
 * @example
 *
 * CustomElement('my-element')
 * class MyElement {
 *   static get observedAttributes() {return [data-attribute]};
 *
 *   attributeSignal = attribute('data-attribute');
 * }
 */
export interface AttributeSignal extends Signal<string> {}

/**
 * ComputedSignal is a {@link Signal} that can be observed and updated from computation.
 * @example
 *
 * const signal = signal(0);
 * const computed = computed(() => signal.value + 1);
 */
export interface ComputedSignal<T> extends ReadonlySignal<T>, Subscription {}

/**
 * SubscriptionMode is a mode of subscription to signal.
 */
export enum SubscriptionMode {
  EFFECT,
  COMPUTED,
  RENDER,
}

/**
 * SignalSubscription holds relation between {@link Action} and dependent {@link Signal}'s and let clean this relation when needed.
 */
export interface SignalSubscription extends Subscription {
  add(containsAction: Signal<unknown>): void;
}

/**
 * {@link Action} is a object that can be scheduled. Is a basic element of {@link Signal}
 * reactive system. This is internal abstraction that is responsible of state propagation.
 */
export interface Action extends Subscription {
  readonly subscriptionMode: SubscriptionMode;
  readonly call: VoidFunction;

  /**
   * Schedule action for the {@link ActionProcessor} matching it {@link SubscriptionMode}.
   */
  schedule(): void;
}

/**
 * {@link LockableAction} is a object that can be locked. It means that it will not propagate its state changes.
 */
export interface LockableAction extends Action, Lockable {}

/**
 * Subscription is a object that can unsubscribe.
 */
export interface Subscription {
  /**
   * Unsubscribe from subscription. This will stop propagation of state changes.
   */
  unsubscribe(): void;
}

/**
 * ActionProcessor is a object that can process {@link Action}.
 * It responsibility is te process {@link Action} for given {@link SubscriptionMode}.
 * It can be used for example to schedule {@link Action} for next tick.
 */
export interface ActionProcessor<T extends Action> {
  /**
   * Takes an action and process it.
   * @param action {@link Action} to process.
   */
  process(action: T): void;
}

/**
 * Symbols used to store actions related to {@link Signal}.
 */
export const ACTIONS = Symbol.for('@@actions');
