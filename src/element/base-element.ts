import { ElementContext } from '../context/element-context';
import { ContextHTMLElement, HTMLElementCallbacks, HTMLElementConstructor, TargetConstructor } from '../model/elements';
import { Context } from '../model/context';
import { CONTEXT } from '../context/context';
import { useSelf } from '../context/use-self';
import { useSupplier } from '../context/use-supplier';

export function getBaseClass(target: TargetConstructor): HTMLElementConstructor {
  return class BaseElement extends HTMLElement implements ContextHTMLElement, HTMLElementCallbacks {
    static get observedAttributes() {
      return target?.observedAttributes ?? [];
    }

    static get target() {
      return target;
    }

    [CONTEXT]: Context = attachContext(this);

    private instance: Partial<HTMLElementCallbacks>;

    constructor() {
      super();
      useSupplier(this, HTMLElement, () => this);
      this.instance = useSupplier(this, target, () => useSelf(target));
    }

    connectedCallback(): void {
      this.instance.connectedCallback?.();
    }
    disconnectedCallback(): void {
      this.instance.connectedCallback?.();
    }
    attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
      this.instance.attributeChangedCallback?.(name, oldValue, newValue);
    }
    adoptedCallback(): void {
      this.instance.adoptedCallback?.();
    }
  };
}

function attachContext(element: HTMLElement): Context {
  const context = new ElementContext();
  context.dependencies.setInstance(HTMLElement, element);
  return context;
}
