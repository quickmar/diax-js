import { ContextHTMLElement, CONTEXT, Context } from '@diax-js/common/context';
import { HTMLElementCallbacks, TargetConstructor, HTMLElementConstructor } from '@diax-js/common/custom-element';
import { ElementContext, useElement, useSelf } from '@diax-js/context';
import { CustomElementDecoratorMetadata, runMetadataHooks } from '@diax-js/common/decorator';

export abstract class BaseElement<T> extends HTMLElement implements ContextHTMLElement, HTMLElementCallbacks {
  protected abstract readonly target: TargetConstructor<T>;
  protected abstract readonly metadata: CustomElementDecoratorMetadata;
  protected component?: T;
  [CONTEXT]: Context;

  private runOnce = () => {
    runMetadataHooks.call(this.component, this.metadata, 'onHostCreated');
    this.runOnce = () => {};
  };

  constructor(metadata: CustomElementDecoratorMetadata) {
    super();
    this[CONTEXT] = new ElementContext(this, metadata);
  }

  connectedCallback(): void {
    useElement(this, () => {
      this.runOnce();
      this.component = useSelf(this.target);
      runMetadataHooks.call(this.component, this.metadata, 'onConnected');
    });
  }

  disconnectedCallback(): void {
    useElement(this, () => {
      runMetadataHooks.call(this.component, this.metadata, 'onDisconnected');
      this[CONTEXT].destroy();
      this.component = undefined;
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
      runMetadataHooks.call(this.component, this.metadata, 'onAdopted');
    });
  }
}

export function getElementClass<T>(
  target: TargetConstructor<T>,
  metadata: CustomElementDecoratorMetadata,
): HTMLElementConstructor {
  return class extends BaseElement<T> {
    static get observedAttributes() {
      return target.observedAttributes;
    }

    static get disabledFeatures() {
      return target.disabledFeatures;
    }

    constructor() {
      super(metadata);
    }

    get target() {
      return target;
    }

    get metadata() {
      return metadata;
    }
  };
}
