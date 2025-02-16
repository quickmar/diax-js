import { AddEventListenersParams, Subscription } from '@diax-js/common/state';
import { getCurrentContext } from '../context';

interface EventListener<K extends keyof HTMLElementEventMap, This> extends Subscription {
  host: HTMLElement;
  type: AddEventListenersParams<K, This>[0];
  listener: OmitThisParameter<AddEventListenersParams<K>[1]>;
  options: AddEventListenersParams<K, This>[2];
  subscribe(): void;
}

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
