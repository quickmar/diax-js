/**
 * @fileoverview This module defines the core interfaces and symbols necessary for implementing a dependency injection system that also manages state and behavior for DOM elements.
 *
 * It includes:
 * - The CONTEXT symbol, used to attach a Context instance to DOM nodes or elements.
 * - The Context interface, which encapsulates the state and behavior associated with a specific host HTMLElement, including attribute management, subscription modes, observables, and cleanup via the Cleanable interface.
 * - The Dependencies interface, responsible for managing dependency injection instances with methods to get, set, check, and remove dependency instances.
 * - Extended interfaces for Node, Element, and HTMLElement (ContextNode, ContextElement, ContextHTMLElement) to include the Context property.
 * - The DI_TOKEN symbol and Token interface, which represent and uniquely identify tokens for dependency injection.
 *
 * @remarks
 * All interfaces extend the Cleanable interface to ensure that resources can be properly released when they are no longer needed.
 */

import { Cleanable } from '../destroying/model';
import { Type } from '../model/common';
import { SubscriptionMode, Signal, Subscription } from '../state/model';

export const CONTEXT = Symbol.for('@@context');

/**
 * Represents a context holding state and behavior for an instance of type T.
 *
 * This interface provides an encapsulation for managing attributes and subscriptions
 * associated with a given host element in the DOM. It extends the Cleanable interface,
 * ensuring that any resources can be freed when they are no longer needed.
 *
 * @typeparam T - The type of the instance associated with this context.
 *
 * @property host - The HTMLElement that acts as the host for this context.
 * @property observedAttributes - A set of attribute names that are being observed.
 * @property attributes - A collection of attributes mapped to their corresponding signals or null.
 * @property instance - The instance of type T that this context encapsulates.
 * @property subscriptionMode - The current subscription mode, or null if not set.
 * @property observables - A set of signals representing observable values.
 * @property ownedSubscriptions - A set of subscriptions owned by this context, used for cleanup.
 * @property dependencies - External dependencies required by this context.
 *
 * @method destroy - Cleans up all associated resources for this context.
 */
export interface Context extends Cleanable {
  readonly host: HTMLElement;
  readonly observedAttributes: Set<string>;
  attributes: Record<string, Signal<string> | null>;
  subscriptionMode: SubscriptionMode | null;
  observables: Set<Signal<unknown>>;
  ownedSubscriptions: Set<Subscription>;
  dependencies: Dependencies;

  destroy(): void;
}

/**
 * Represents a container for managing dependency instances with the ability to clean up resources.
 *
 * This interface extends Cleanable to ensure that any resources held by the dependencies
 * can be properly disposed of when no longer needed. It provides methods to interact with
 * dependency instances associated with specific tokens.
 *
 * @remarks
 * The dependencies container encapsulates the logic for storing, retrieving, checking,
 * and removing instances by their respective tokens, allowing for flexible and type-safe
 * dependency management.
 *
 * @interface Dependencies
 */
export interface Dependencies extends Cleanable {
  getInstance<T>(token: Token<T>): T;

  setInstance<T>(token: Token<T>, instance: T | null): void;

  hasInstance<T>(token: Token<T>): boolean;

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
