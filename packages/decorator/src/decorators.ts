import { Method } from '@diax-js/common';
import {
  CustomElementDecorator,
  CustomElementMethodDecorator,
  RunnableKey,
  addMetadataHook,
} from '@diax-js/common/decorator';
import { AddEventListenersParams } from '@diax-js/common/state';
import { attachListener, attachShadow } from '@diax-js/context/host';

/**
 * Decorator that binds the original method to the class instance.
 *
 * This decorator is applied to a method and ensures that the method's `this` context
 * is permanently bound to the instance on which the method is defined. It does so by
 * adding an initializer that reassigns the method on the instance to its bound version.
 *
 * @param value - The original method to be bound.
 * @param context - {@link ClassMethodDecoratorContext}
 */
export const Bind: CustomElementMethodDecorator = function (value, { kind, addInitializer, name }) {
  if (kind !== 'method') return;
  addInitializer(function (this: ThisParameterType<typeof value>) {
    this[name as keyof typeof this] = value.bind(this) as (typeof this)[keyof typeof this];
  });
};

/**
 * A method decorator that attaches an event listener to an element when it connects to the DOM.
 *
 * @param eventType - The type of event to listen for. Must be one of the keys from HTMLElementEventMap.
 * @param options - Optional parameters for the event listener (e.g. capture, once, passive).
 *
 * @remarks
 * This decorator binds the decorated method to the target instance and
 * ensure the listener is attached to the host during the element's connection phase.
 * It take care of removing the listener when element is disconnected.
 *
 * @example
 *
 * @CustomElement("my-component")
 * class MyComponent {
 *   @AttachListener('click')
 *   handleClick(event: MouseEvent): void {
 *     console.log('Element clicked:', event);
 *   }
 * }
 *
 */
export function AttachListener<K extends keyof HTMLElementEventMap>(
  eventType: K,
  options?: AddEventListenersParams<any>[2],
) {
  return function <This, Value extends Method<This, (e: HTMLElementEventMap[K]) => any>>(
    value: Value,
    { kind, metadata }: ClassMethodDecoratorContext<This, Value>,
  ) {
    if (kind !== 'method') return;
    addMetadataHook(metadata, 'connected', function (this: ThisParameterType<typeof value>) {
      attachListener(eventType, value.bind(this), options);
    });
  };
}

/**
 * A decorator factory that attaches a shadow root to a custom element host.
 *
 * This decorator sets up a metadata hook that will attach a shadow root to the host element
 * when it is created. The shadow root is configured using the provided options.
 *
 * @param init - The initialization options for the shadow root. Defaults to { mode: 'open' }.
 *
 * @returns A custom element decorator function that adds the "onHostCreated" metadata hook.
 */
export function AttachShadow(init: ShadowRootInit = { mode: 'open' }): CustomElementDecorator {
  return function (_, { metadata }) {
    addMetadataHook(metadata, 'created', () => {
      attachShadow(init);
    });
  };
}

/**
 * Decorator for specifying observed attributes on a custom element.
 *
 * @remarks
 * When applied to a custom element, this decorator assigns the provided attribute names
 * to resulting HTMLElement "observedAttributes" property. The decorated element
 * will then observe these attributes for changes.
 *
 * @param attributes - A list of attribute names that the custom element should observe.
 *
 * @returns A decorator function that sets the observed attributes in the custom element's metadata.
 *
 */
export function ObservedAttributes(...attributes: string[]): CustomElementDecorator {
  return function (_, { metadata }) {
    metadata.observedAttributes = attributes;
  };
}

/**
 * Decorator for methods that should be executed upon connection.
 *
 * Applies a void callback mechanism tied to the "connectedCallback" event, ensuring that the decorated method
 * is called when the connection lifecycle event occurs.
 *
 * @remarks
 * Use this decorator to annotate functions that should run post-connection, without the expectation
 * of a return value.
 *
 * @see voidCallbackDecorator for implementation details.
 *
 *@example
 *
 * @CustomElement('my-element')
 * class MyElement {
 *   @Connected
 *   connected() {
 *     // Called when the element is connected to the DOM
 *   }
 * }
 * ```
 */
export const Connected = voidCallbackDecorator('connected');

/**
 * Decorator that marks a method to be called before the object is disconnected.
 *
 * This decorator is implemented by the underlying voidCallbackDecorator,
 * using 'onDisconnected' as the event key. When applied, the decorated method
 * will be registered to execute during the disconnection phase, allowing for
 * cleanup or other pre-disconnect operations.
 *
 * @remarks
 * - Useful for managing resource deallocation or other necessary shutdown procedures.
 * - Ensures that the method is invoked in a context that does not expect a return value.
 *
 *```typescript
 * @CustomElement('my-element')
 * class MyElement {
 *   @Disconnected
 *   disconnect() {
 *     // Called when the element is disconnected from the DOM
 *   }
 * }
 * ```
 *
 * @see voidCallbackDecorator for implementation details.
 */
export const Disconnected = voidCallbackDecorator('disconnected');

/**
 * Decorator that applies a void callback for the "onAdopted" lifecycle event.
 *
 * @remarks
 * When applied, the corresponding class is expected to implement an "onAdopted" method
 * that will be called upon adoption of the element. This facilitates the handling
 * of the element's adoption into the DOM.
 *
 * @example
 * ```typescript
   @CustomElement('my-element')
 * class MyElement {
     @Adopted
 *   onAdopted() {
 *     // Called when the element is added to the DOM
 *   }
 * }
 * ```
 *
 * @see voidCallbackDecorator for implementation details.
 */
export const Adopted = voidCallbackDecorator('adopted');

function voidCallbackDecorator(key: RunnableKey): CustomElementMethodDecorator<() => void> {
  return function (value, { kind, metadata, name }) {
    if (kind !== 'method' || name === key) return;
    addMetadataHook(metadata, key, function (this: ThisParameterType<typeof value>) {
      value.call(this);
    });
  };
}
