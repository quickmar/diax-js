import { Method, NoArgType } from '../model/common';

/**
 * Provides metadata configuration for custom element decorators.
 *
 * @remarks
 * This interface extends {@link DecoratorMetadataObject} and includes additional properties used
 * during the lifecycle of custom elements.
 *
 * @property observedAttributes - An optional array of attribute names to be observed for changes.
 * @property disabledOptions - Optional array of options that are disabled within this context.
 * @property onHostCreated - Optional array of callback functions executed when the host is created.
 * @property onConnected - Optional array of callback functions executed when the element is connected to the DOM.
 * @property onDisconnected - Optional array of callback functions executed when the element is disconnected from the DOM.
 */
export interface CustomElementDecoratorMetadata extends DecoratorMetadataObject {
  observedAttributes?: string[];
  disabledOptions?: string[];
  onHostCreated?: VoidFunction[];
  onConnected?: VoidFunction[];
  onDisconnected?: VoidFunction[];
}

/**
 * A decorator function that defines a custom element.
 *
 * @param tagName - The name of the custom element
 *
 * @returns A decorator function that defines the custom element
 */

export type CustomElementDecorator = <T>(target: NoArgType<T>, context: ClassDecoratorContext) => void;

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
