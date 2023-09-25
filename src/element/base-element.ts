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
import { useSelf } from '../context/use-self';
import { useElement } from '../context/use-element';

export class BaseElement extends HTMLElement implements ContextHTMLElement, HTMLElementCallbacks {
  [CONTEXT]: Context = new ElementContext(this);

  protected instance: TargetCallbacks = {};

  constructor(ctor: TargetConstructor) {
    super();
    useElement(this, () => {
      this.instance = useSelf(ctor);
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

export function getElementClass(target: TargetConstructor): HTMLElementConstructor {
  return class extends BaseElement implements ContextHTMLElement, HTMLElementCallbacks {
    static get observedAttributes() {
      return target.observedAttributes ?? [];
    }

    static get target() {
      return target;
    }

    constructor() {
      super(target);
    }
  };
}
