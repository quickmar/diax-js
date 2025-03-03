import { TargetCallbacks } from '../custom-element/model';
import { Method, NoArgType } from '../model/common';

/**
 * Provides metadata configuration for custom element decorators.
 *
 * @interface CustomElementDecoratorMetadata
 *
 * @property observedAttributes - An optional array of attribute names that the custom element observes for changes.
 * @property disabledOptions - An optional list of options that are disabled, possibly controlling certain decorator behaviors.
 * @property onHostCreated - An optional array of callbacks executed when the host element is created.
 * @property onConnected - An optional array of callbacks executed when the custom element is connected to the DOM.
 * @property onDisconnected - An optional array of callbacks executed when the custom element is disconnected from the DOM.
 * @property onAdopted - An optional array of callbacks executed when the custom element is adopted into a new document.
 */
export interface CustomElementDecoratorMetadata extends Record<string, unknown[]> {
  observedAttributes: string[];
  disabledFeatures: string[];
  disabledOptions: string[];
  created: VoidFunction[];
  connected: VoidFunction[];
  disconnected: VoidFunction[];
  adopted: VoidFunction[];
}

/**
 * A decorator function that defines a custom element.
 *
 * @param tagName - The name of the custom element
 *
 * @returns A decorator function that defines the custom element
 */

export type CustomElementDecorator = <T extends TargetCallbacks>(
  target: NoArgType<T>,
  context: ClassDecoratorContext,
) => void;

/**
 * A decorator type for class methods used in custom elements.
 *
 * @template F - The type of the method being decorated. Defaults to a function signature with arbitrary parameters and return type ((...args: any[]) => any).
 * @template T - The type of the object containing the method.
 *
 * This decorator receives a target method along with its decorator context, and it may either modify the method
 * or leave it unchanged. When applied, it can perform additional processing, side effects, or replacements on the original method.
 *
 * @param target - The method to be decorated.
 * @param context - The context providing metadata about the class method.
 *
 * @returns Either nothing (void) to leave the method unmodified or a new method that replaces the original.
 */
export type CustomElementMethodDecorator<F extends (...args: any[]) => any = (...args: any[]) => any> = <T>(
  target: Method<T, F>,
  context: ClassMethodDecoratorContext<T, F>,
) => void | Method<T, F>;
