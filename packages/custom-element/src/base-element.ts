import { CONTEXT, Context } from '@diax-js/common/context';
import {
  TargetConstructor,
  HTMLElementConstructor,
  BaseHTMLElement,
  TargetCallbacks,
} from '@diax-js/common/custom-element';
import { ElementContext, useElement, useSelf } from '@diax-js/context';
import {
  CallbackRunnableKey,
  CustomElementDecoratorMetadata,
  runMetadataHooks,
  RunnableKey,
} from '@diax-js/common/decorator';

const contexts = new WeakMap<BaseElement<TargetCallbacks>, Context>();

export abstract class BaseElement<T extends TargetCallbacks> extends HTMLElement implements BaseHTMLElement<T> {
  abstract readonly target: TargetConstructor<T>;
  abstract readonly metadata: CustomElementDecoratorMetadata;
  protected component?: T;
  readonly [CONTEXT]: Context;

  private runOnce = () => {
    runMetadataHooks.call(this.component, this.metadata, 'created');
    this.runOnce = () => {};
  };

  constructor() {
    super();
    this[CONTEXT] = new ElementContext(this);
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
  metadata?: CustomElementDecoratorMetadata,
): HTMLElementConstructor<T> {
  const meta = extendsMetadata(target, metadata ?? {});

  return class extends BaseElement<T> {
    static get observedAttributes() {
      return meta.observedAttributes;
    }

    static get disabledFeatures() {
      return meta.disabledFeatures;
    }

    get target() {
      return target;
    }

    get metadata() {
      return meta;
    }
  };
}

export function extendsMetadata<T extends TargetCallbacks>(
  target: TargetConstructor<T>,
  metadata: CustomElementDecoratorMetadata,
): CustomElementDecoratorMetadata {
  const meta: CustomElementDecoratorMetadata = {
    observedAttributes: [],
    disabledFeatures: [],
    adopted: [],
    connected: [],
    disconnected: [],
    created: [],
    disabledOptions: [],
    ...metadata,
  };
  assignObservedAttributes(target, meta);
  assignDisabledFeatures(target, meta);
  assignCallbacks('connected', target, meta);
  assignCallbacks('disconnected', target, meta);
  assignCallbacks('adopted', target, meta);
  return meta;
}

function assignCallbacks<T extends TargetCallbacks>(
  key: CallbackRunnableKey,
  target: TargetConstructor<T>,
  metadata: CustomElementDecoratorMetadata,
) {
  if (!metadata[key]) {
    metadata[key] = [];
  }
  metadata[key]?.push(function (this: T) {
    target.prototype[key]?.call(this);
  });
}

function assignObservedAttributes<T extends TargetCallbacks>(
  target: TargetConstructor<T>,
  metadata: CustomElementDecoratorMetadata,
) {
  metadata.observedAttributes!.push(...(target.observedAttributes ?? []));
}

function assignDisabledFeatures<T extends TargetCallbacks>(
  target: TargetConstructor<T>,
  metadata: CustomElementDecoratorMetadata,
) {
  metadata.disabledFeatures!.push(...(target.disabledFeatures ?? []));
}
