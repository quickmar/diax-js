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
  [CONTEXT]: Context;

  get instance(): T {
    return this[CONTEXT].instance as T;
  }

  constructor() {
    super();
    const context = new ElementContext<T>(this);
    this[CONTEXT] = context;
  }

  connectedCallback(): void {
    useElement(this, () => {
      const target = (this.constructor as HTMLElementConstructor<T>).target;
      this[CONTEXT].instance = useSelf(target);
      this.instance.init?.();
    });
  }
  disconnectedCallback(): void {
    useElement(this, () => {
      this[CONTEXT].destroy();
    });
  }
  attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    const attribute = this[CONTEXT].attributes[name];
    if (attribute) {
      attribute.value = newValue;
    }
  }
  adoptedCallback(): void {
    useElement(this, () => {
      this.instance.adopt?.();
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
