import { Cleanable } from '../destroying/model';
import { TargetCallbacks } from '../custom-element/model';
import { Type } from '../model/common';
import { SubscriptionMode, Signal, Subscription } from '../state/model';

/**
 * The symbol for the context @link Context.
 *
 * @constant {Symbol} CONTEXT
 */
export const CONTEXT = Symbol.for('@@context');

/**
 * The Context interface is responsible for managing the state and lifecycle of UI components or other entities in diax-js based components.
 * Context is attached to the host element of the component and it is used as a free ubound variable for synchronous function stack.
 * Those functions are selected from HTMLElement lifecycle methods, event handlers etc. and acts as as a root function stack. 
 * All children stacks are attached to the context and they have access to the context. 
 * 
 * @template T - The type of the target callbacks.
 *
 * @interface Context
 * @extends {Cleanable}
 *
 * @property {HTMLElement} host - The host element of the context.
 * @property {Set<string>} observedAttributes - The set of observed attributes.
 * @property {Record<string, Signal<string> | null>} attributes - The record of attributes.
 * @property {T} instance - The instance of the target callbacks.
 * @property {SubscriptionMode | null} subscriptionMode - The subscription mode of the context.
 * @property {Set<Signal<unknown>>} observables - The set of observables.
 * @property {Set<Subscription>} ownedSubscriptions - The set of owned subscriptions.
 * @property {Dependencies} dependencies - The dependencies of the context.

 */
export interface Context<T extends TargetCallbacks = TargetCallbacks> extends Cleanable {
  readonly host: HTMLElement;
  readonly observedAttributes: Set<string>;
  attributes: Record<string, Signal<string> | null>;
  instance: T;
  subscriptionMode: SubscriptionMode | null;
  observables: Set<Signal<unknown>>;
  ownedSubscriptions: Set<Subscription>;
  dependencies: Dependencies;
  /**
   * The destroy method is responsible for destroying the context.
   */
  destroy(): void;
}

/**
 * The Dependencies interface is responsible for managing the instances of dependencies.
 *
 * @interface Dependencies
 * @extends {Cleanable}
 */
export interface Dependencies extends Cleanable {
  /**
   * The getInstance method is responsible for retrieving the instance of the dependency.
   * @param token - The token of the dependency.
   * @returns The instance of the dependency.
   */
  getInstance<T>(token: Token<T>): T;

  /**
   * The setInstance method is responsible for setting the instance of the dependency.
   * @param token - The token of the dependency.
   * @param instance - The instance of the dependency.
   */
  setInstance<T>(token: Token<T>, instance: T | null): void;

  /**
   * The hasInstance method is responsible for checking whether the dependency has instance.
   * 
   * @param token - The token of the dependency.
   * @returns Whether the dependency has instance.
   */
  hasInstance<T>(token: Token<T>): boolean;

  /**
   * The removeInstance method is responsible for removing the instance of the dependency.
   *
   * @param token - The index of the dependency.
   */
  removeInstance<T>(token: Token<T>): void;
}

/**
 * The Node interface is responsible for managing the context of a node.
 *
 * @interface Node
 * @extends {Cleanable}
 */
export interface ContextNode extends Node {
  readonly [CONTEXT]: Context;
}

/**
 * The Element interface is responsible for managing the context of an element.
 *
 * @interface Element
 * @extends {Cleanable}
 *
 */
export interface ContextElement extends Element {
  readonly [CONTEXT]: Context;
}

/**
 * The HTMLElement interface is responsible for managing the context of an HTML element.
 *
 * @interface HTMLElement
 * @extends {Cleanable}
 */
export interface ContextHTMLElement extends HTMLElement {
  readonly [CONTEXT]: Context;
}

/**
 * This symbol is attached to the class and act as a holder for the Token.
 *
 * @constant {Symbol} DI_TOKEN
 */
export const DI_TOKEN = Symbol.for('@@token');

interface _Token<T> {
  type: Type<T>;
  name: string;
  readonly di_index: number;
}

/**
 * The Token is responsible for representing given Type or other entity in dependency injection system.
 *
 * @template T - The type of the instance.
 *
 * @property {Type<T>} type - The type to be represented.
 * @property {string} name - The name of the token.
 * @property {number} di_index - The unique index in document scope.
 *
 * @interface Token
 */
export interface Token<T> extends Omit<_Token<T>, 'type'> {}
