import { CONTEXT, Context } from '@diax-js/common/context';
import {
  TargetConstructor,
  HTMLElementConstructor,
  BaseHTMLElement,
  TargetCallbacks,
} from '@diax-js/common/custom-element';
import { ElementContext, useElement, useSelf } from '@diax-js/context';
import { CustomElementDecoratorMetadata, runMetadataHooks } from '@diax-js/common/decorator';

export abstract class BaseElement<T extends TargetCallbacks> extends HTMLElement implements BaseHTMLElement<T> {
  abstract readonly target: TargetConstructor<T>;
  abstract readonly metadata: CustomElementDecoratorMetadata;
  protected component?: T;
  readonly [CONTEXT]: Context;

  private runOnce = () => {
    runMetadataHooks.call(this.component, this.metadata, 'created');
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
      runMetadataHooks.call(this.component, this.metadata, 'connected');
    });
  }

  disconnectedCallback(): void {
    useElement(this, () => {
      runMetadataHooks.call(this.component, this.metadata, 'disconnected');
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
      runMetadataHooks.call(this.component, this.metadata, 'adopted');
    });
  }
}

export function getElementClass<T extends TargetCallbacks>(
  target: TargetConstructor<T>,
  metadata: CustomElementDecoratorMetadata,
): HTMLElementConstructor<T> {
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
