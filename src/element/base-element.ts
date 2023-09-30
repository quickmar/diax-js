import { ElementContext } from '../context/element-context';
import {
  ContextHTMLElement,
  HTMLElementCallbacks,
  HTMLElementConstructor,
  TargetCallbacks,
  TargetConstructor,
} from '../model/elements';
import { Context } from '../model/context';
import { CONTEXT } from '../context/context';
import { useElement } from '../context/use-element';
import { Supplier } from '../model/common';
import { useSelf } from '../elements';

export class BaseElement<T extends TargetCallbacks>
  extends HTMLElement
  implements ContextHTMLElement, HTMLElementCallbacks
{
  [CONTEXT]: Context = new ElementContext(this);

  protected instance: T = {} as T;

  constructor(supplier: Supplier<T>) {
    super();
    useElement(this, () => {
      this.instance = supplier();
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
      return target.observedAttributes ?? [];
    }

    static get target() {
      return target;
    }

    constructor() {
      super(() => useSelf(target));
    }
  };
}
