import { ContextHTMLElement } from '../context/model';
import { CustomElementDecoratorMetadata } from '../decorator/model';
import { NoArgType } from '../model/common';

/**
 * Interface representing features that can be disabled on an element.
 *
 * @interface
 * @property {Array<'shadow' | 'internals'>} disabledFeatures - An array of features that should be disabled.
 *                                                              Possible values are:
 *                                                              - 'shadow': Disables Shadow DOM
 *                                                              - 'internals': Disables ElementInternals
 */
export interface DisabledFeatures {
  readonly disabledFeatures: ('shadow' | 'internals')[];
}

export interface TargetCallbacks {
  connected?(): void;
  disconnected?(): void;
  adopted?(): void;
}

/**
 * Represents a constructor interface for a custom element target with callback methods.
 *
 * @template T - Type extending TargetCallbacks defining the callback methods
 *
 * @property {string[]} [observedAttributes] - Array of attribute names to be observed for changes
 * @property {string[]} [disabledFeatures] - Array of feature names that should be disabled for this element
 */
export interface TargetConstructor<T extends TargetCallbacks> extends NoArgType<T> {
  readonly observedAttributes?: string[];
  readonly disabledFeatures?: string[];
}

/**
 * Represents a constructor interface for HTML custom elements with specific target callbacks.
 *
 * @typeParam T - The type of target callbacks that this element will support
 *
 * @property target - The constructor for the target that handles element callbacks
 * @property observedAttributes - Optional array of attribute names to observe for changes
 * @property disabledFeatures - Optional array of feature names that should be disabled for this element
 *
 * @extends NoArgType<ContextHTMLElement & HTMLElementCallbacks>
 */
export interface HTMLElementConstructor<T extends TargetCallbacks> extends NoArgType<BaseHTMLElement<T>> {
  readonly observedAttributes: string[] | undefined;
  readonly disabledFeatures: string[] | undefined;
}

/**
 * Interface representing lifecycle callbacks for custom HTML elements.
 * These callbacks are automatically called by the browser at specific moments in an element's lifecycle.
 *
 * @interface HTMLElementCallbacks
 *
 * @property {() => void} connectedCallback - Called when the element is inserted into the DOM
 * @property {() => void} disconnectedCallback - Called when the element is removed from the DOM
 * @property {(name: string, oldValue: unknown, newValue: unknown) => void} attributeChangedCallback - Called when an observed attribute is changed, added, or removed
 * @property {() => void} adoptedCallback - Called when the element is moved to a new document
 */
export interface HTMLElementCallbacks {
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void;
  adoptedCallback(): void;
}

export interface BaseHTMLElement<T extends TargetCallbacks> extends ContextHTMLElement, HTMLElementCallbacks {
  readonly target: TargetConstructor<T>;
  readonly metadata: CustomElementDecoratorMetadata;
}
