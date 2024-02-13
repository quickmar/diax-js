import { ContextHTMLElement, CONTEXT, Context } from '@diax-js/common/context';
import {
  TargetCallbacks,
  HTMLElementCallbacks,
  TargetConstructor,
  HTMLElementConstructor,
} from '@diax-js/common/custom-element';
import { ElementContext, useElement, useSelf } from '@diax-js/context';

export class BaseElement<T extends TargetCallbacks>
  extends HTMLElement
  implements ContextHTMLElement, HTMLElementCallbacks
{
  [CONTEXT]: Context = new ElementContext<T>(this);

  get instance(): T {
    return this[CONTEXT].instance as T;
  }

  constructor() {
    super();
  }

  connectedCallback(): void {
    useElement(this, () => {
      const target = (this.constructor as HTMLElementConstructor<T>).target;
      this[CONTEXT].instance = useSelf(target);
      this.instance.connectedCallback?.();
    });
  }
  disconnectedCallback(): void {
    useElement(this, () => {
      this.instance.disconnectedCallback?.();
      this[CONTEXT].destroy();
    });
  }
  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
    useElement(this, () => {
      this.instance.attributeChangedCallback?.(name, oldValue, newValue);
      // reimplement
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
  };
}
