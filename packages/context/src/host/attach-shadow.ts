import { useSupplier } from '../use-supplier';
import { useHost } from './use-host';

/**
 * Attaches a shadow root to the host element if one does not already exist.
 *
 * If the host element does not already have a shadow root, this function attaches a new shadow
 * root using the provided initialization options, registers it as dependency in {@link Context},
 * and returns it. If a shadow root already exists on the host, the existing shadow root is returned.
 *
 * @param init - An object containing properties that control the behavior of the shadow root (mode, delegatesFocus, etc.).
 * @returns The existing or newly attached shadow root.
 */
export const attachShadow = (init: ShadowRootInit) => {
  const host = useHost();
  if (!host.shadowRoot) {
    const shadowRoot = host.attachShadow(init);
    useSupplier(ShadowRoot, () => shadowRoot);
    return shadowRoot;
  }
  return host.shadowRoot;
};
