import { NoArgType } from '../model/common';


export interface CustomElementDecoratorMetadata extends DecoratorMetadataObject {
  observedAttributes?: string[];
  disabledOptions?: string[];
  shadowRootInit?: ShadowRootInit;
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
