import { useSupplier } from '../use-supplier';
import { useHost } from './use-host';

export const attachShadow = (init: ShadowRootInit) => {
  const host = useHost();
  if (host.shadowRoot === null) {
    const shadowRoot = host.attachShadow(init);
    useSupplier(ShadowRoot, () => shadowRoot);
    return shadowRoot;
  }
  return host.shadowRoot;
};
