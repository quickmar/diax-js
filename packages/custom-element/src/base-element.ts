import { ContextHTMLElement, CONTEXT, Context } from '@diax-js/common/context';
import {
  TargetCallbacks,
  HTMLElementCallbacks,
  TargetConstructor,
  HTMLElementConstructor,
} from '@diax-js/common/custom-element';
import { AttributeSignal } from '@diax-js/common/state';
import { ElementContext, useElement, useSelf } from '@diax-js/context';
import { signal } from '@diax-js/state';

const initAttributes = (observedAttributes: string[]) => {
  return Object.freeze(
    observedAttributes.reduce((record, attribute) => Object.assign(record, { [attribute]: signal('') }), {}),
  ) as Record<string, AttributeSignal>;
};

export class BaseElement<T extends TargetCallbacks>
  extends HTMLElement
  implements ContextHTMLElement, HTMLElementCallbacks
{
  [CONTEXT]: Context = new ElementContext<T>(this, initAttributes(this._target.observedAttributes ?? []));

  get instance(): T {
    return this[CONTEXT].instance as T;
  }

  protected get _target() {
    return (this.constructor as HTMLElementConstructor<T>).target;
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
  attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    const { attributes } = this[CONTEXT];
    attributes[name].value = newValue;
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
