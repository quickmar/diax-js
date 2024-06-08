import { ContextHTMLElement, CONTEXT, Context } from '@diax-js/common/context';
import {
  TargetCallbacks,
  HTMLElementCallbacks,
  TargetConstructor,
  HTMLElementConstructor,
  DisabledFeatures,
} from '@diax-js/common/custom-element';
import { DISABLED_FEATURES } from '@diax-js/common/support';
import { ElementContext, useDocument, useElement, useSelf, useToken } from '@diax-js/context';

let systemDisabledFeatures: DisabledFeatures;

useDocument(() => {
  systemDisabledFeatures = useToken(DISABLED_FEATURES, () => {
    // If instance of DISABLED_FEATURES is defined before this script.
    // This implementation will be supplied to the document context.
    // And all elements for this document will have the same disabled features.
    // Otherwise, this default implementation will be supplied to the document context.
    return {
      get disabledFeatures() {
        return [];
      },
    };
  });
});

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
      attribute.setValue(newValue);
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

    static get disabledFeatures() {
      return [...systemDisabledFeatures.disabledFeatures, ...(target.disabledFeatures ?? [])];
    }

    static get target() {
      return target;
    }
  };
}
