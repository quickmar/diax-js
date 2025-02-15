import {
  CustomElementDecorator,
  CustomElementMethodDecorator,
  RunnableKey,
  addMetadataHook,
} from '@diax-js/common/decorator';
import { attachShadow } from '@diax-js/context/host';

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
    addMetadataHook(metadata, 'onHostCreated', () => {
      attachShadow(init);
    });
  };
}

/**
 * Decorator for specifying observed attributes on a custom element.
 *
 * @remarks
 * When applied to a custom element, this decorator assigns the provided attribute names
 * to the element's metadata (under the property "observedAttributes"). The decorated element
 * will then observe these attributes for changes.
 *
 * @param attributes - A list of attribute names that the custom element should observe.
 *
 * @returns A decorator function that sets the observed attributes in the custom element's metadata.
 */
export function ObservedAttributes(...attributes: string[]): CustomElementDecorator {
  return function (_, { metadata }) {
    metadata.observedAttributes = attributes;
  };
}

/**
 * Decorator for methods that should be executed upon connection.
 *
 * Applies a void callback mechanism tied to the "onConnected" event, ensuring that the decorated method
 * is called when the connection lifecycle event occurs.
 *
 * @remarks
 * Use this decorator to annotate functions that should run post-connection, without the expectation
 * of a return value.
 *
 * @example
 * ```typescript
 * @postConnect
 * onInitialize() {
 *   // Initialization logic here.
 * }
 * ```
 */
export const PostConnect = voidCallbackDecorator('onConnected');

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
 */
export const PreDisconnect = voidCallbackDecorator('onDisconnected');

function voidCallbackDecorator(key: RunnableKey): CustomElementMethodDecorator<() => void> {
  return function (value, { addInitializer, kind, metadata }) {
    if (kind !== 'method') return;
    let initialized = false;
    addInitializer(function () {
      if (initialized) return;
      initialized = true;
      const self = this;
      addMetadataHook(metadata, key, () => {
        value.call(self);
      });
    });
  };
}
