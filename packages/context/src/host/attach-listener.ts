import { AddEventListenersParams, Subscription } from '@diax-js/common/state';
import { getCurrentContext } from '../context';

interface EventListener<K extends keyof HTMLElementEventMap, This> extends Subscription {
  host: HTMLElement;
  type: AddEventListenersParams<K, This>[0];
  listener: OmitThisParameter<AddEventListenersParams<K>[1]>;
  options: AddEventListenersParams<K, This>[2];
  subscribe(): void;
}

/**
 * Attaches an event listener to the current host element obtained from the context,
 * and automatically manages its subscription lifecycle.
 *
 * @typeParam K - The type of the event as defined in HTMLElementEventMap.
 * @typeParam This - The type of the 'this' context for the event listener.
 *
 * @param type - The event type to listen for.
 * @param listener - The event listener callback function, with its 'this' parameter omitted.
 * @param options - Optional options for configuring the event listener.
 *
 * @returns A function that, when called, unsubscribes (removes) the attached event listener.
 *
 * @remarks
 * This function retrieves the current context to determine the host element and the
 * set of subscriptions owned by context. It immediately add listener it on the host element,
 * and registers the subscription. Calling the returned function or disconnecting host element,
 * will remove the event listener and clean up the associated subscription.
 */
export const attachListener = <K extends keyof HTMLElementEventMap, This>(
  type: AddEventListenersParams<K, This>[0],
  listener: OmitThisParameter<AddEventListenersParams<K>[1]>,
  options: AddEventListenersParams<K, This>[2],
) => {
  const { host, ownedSubscriptions } = getCurrentContext();

  const actualListener: AddEventListenersParams<K, HTMLElement>[1] = function (event) {
    return listener(event);
  };

  const subscription: EventListener<K, This> = {
    host,
    type,
    listener: actualListener,
    options,
    subscribe() {
      this.host.addEventListener(type, this.listener, options);
    },
    unsubscribe() {
      this.host.removeEventListener(this.type, this.listener, this.options);
      Object.assign(this, { host: null, listener: null, options: null, type: null });
    },
  };

  subscription.subscribe();
  ownedSubscriptions.add(subscription);

  return subscription.unsubscribe.bind(subscription);
};
