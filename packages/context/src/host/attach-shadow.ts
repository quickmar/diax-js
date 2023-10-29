import { getCurrentContext } from '../context';
import { useSupplier } from '../use-supplier';

export const attachShadow = (init: ShadowRootInit) => {
  const host = getCurrentContext().host;
  if (host.shadowRoot === null) {
    const shadowRoot = host.attachShadow(init);
    useSupplier(ShadowRoot, () => shadowRoot);
    return shadowRoot;
  }
  return host.shadowRoot;
};
