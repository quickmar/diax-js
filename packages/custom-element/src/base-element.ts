import {
  CONTEXT,
  Context,
  ContextHTMLElement,
  HTMLElementCallbacks,
  HTMLElementConstructor,
  Supplier,
  TargetCallbacks,
  TargetConstructor,
} from '@diax/common';
import { ElementContext, useElement, useSelf } from '@diax/context';

export class BaseElement<T extends TargetCallbacks>
  extends HTMLElement
  implements ContextHTMLElement, HTMLElementCallbacks
{
  [CONTEXT]: Context = new ElementContext<T>(this);

  get instance(): T {
    return this[CONTEXT].instance as T;
  }

  constructor(supplier: Supplier<T>) {
    super();
    useElement(this, () => {
      this[CONTEXT].instance = supplier();
    });
  }

  connectedCallback(): void {
    useElement(this, () => {
      this.instance.connectedCallback?.();
    });
  }
  disconnectedCallback(): void {
    useElement(this, () => {
      this.instance.disconnectedCallback?.();
    });
  }
  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
    useElement(this, () => {
      this.instance.attributeChangedCallback?.(name, oldValue, newValue);
    });
  }
  adoptedCallback(): void {
    useElement(this, () => {
      this.instance.adoptedCallback?.();
    });
  }
}

export function getElementClass(target: TargetConstructor<TargetCallbacks>): HTMLElementConstructor<TargetCallbacks> {
  return class extends BaseElement<TargetCallbacks> {
    static get observedAttributes() {
      return target.observedAttributes;
    }

    static get target() {
      return target;
    }

    constructor() {
      super(() => useSelf(target));
    }
  };
}
