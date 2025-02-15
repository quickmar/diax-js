import { ContextHTMLElement, CONTEXT, Context } from '@diax-js/common/context';
import { HTMLElementCallbacks, TargetConstructor, HTMLElementConstructor } from '@diax-js/common/custom-element';
import { ElementContext, useElement, useSelf } from '@diax-js/context';
import { CustomElementDecoratorMetadata, runMetadataHooks } from '@diax-js/common/decorator';

export abstract class BaseElement<T> extends HTMLElement implements ContextHTMLElement, HTMLElementCallbacks {
  abstract readonly target: TargetConstructor<T>;
  [CONTEXT]: Context;
  protected component?: T;

  constructor(metadata: CustomElementDecoratorMetadata) {
    super();
    this[CONTEXT] = new ElementContext(this, metadata);
    runMetadataHooks(metadata, 'onHostCreated');
  }

  connectedCallback(): void {
    useElement(this, () => {
      this.component = useSelf(this.target);
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
      // TODO: Implement adoptedCallback
    });
  }
}

export function getElementClass<T>(
  target: TargetConstructor<T>,
  metadata: DecoratorMetadataObject,
): HTMLElementConstructor {
  return class extends BaseElement<T> {
    static get observedAttributes() {
      return target.observedAttributes;
    }

    static get disabledFeatures() {
      return [...(target.disabledFeatures ?? [])];
    }

    constructor() {
      super(metadata);
    }

    get target() {
      return target;
    }
  };
}
