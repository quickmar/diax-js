import { CONTEXT, Context } from '@diax-js/common/context';
import {
  TargetConstructor,
  HTMLElementConstructor,
  BaseHTMLElement,
  TargetCallbacks,
} from '@diax-js/common/custom-element';
import { ElementContext, useElement, useSelf } from '@diax-js/context';
import { CustomElementDecoratorMetadata, runMetadataHooks } from '@diax-js/common/decorator';

const contexts = new WeakMap<BaseElement<TargetCallbacks>, Context>();

export abstract class BaseElement<T extends TargetCallbacks> extends HTMLElement implements BaseHTMLElement<T> {
  abstract readonly target: TargetConstructor<T>;
  abstract readonly metadata: CustomElementDecoratorMetadata;
  protected component?: T;
  readonly [CONTEXT]: Context;

  private runOnce = () => {
    runMetadataHooks(this.component, this.metadata, 'created');
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
      runMetadataHooks(this.component, this.metadata, 'connected');
    });
  }

  disconnectedCallback(): void {
    useElement(this, () => {
      runMetadataHooks(this.component, this.metadata, 'disconnected');
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
      runMetadataHooks(this.component, this.metadata, 'adopted');
    });
  }
}

export function getElementClass<T extends TargetCallbacks>(
  target: TargetConstructor<T>,
  metadata?: DecoratorMetadataObject,
): HTMLElementConstructor<T> {
  metadata = metadata ?? {};
  if (!extendMetadata(target, metadata)) {
    panic();
  }

  return class extends BaseElement<T> {
    static get observedAttributes() {
      return metadata.observedAttributes;
    }

    static get disabledFeatures() {
      return metadata.disabledFeatures;
    }

    get target() {
      return target;
    }

    get metadata() {
      return metadata;
    }
  };
}

export function extendMetadata<T extends TargetCallbacks>(
  target: TargetConstructor<T>,
  metadata: object,
): metadata is CustomElementDecoratorMetadata {
  assignObservedAttributes(target, metadata);
  assignDisabledFeatures(target, metadata);
  assignCallbacks('connected', target, metadata);
  assignCallbacks('disconnected', target, metadata);
  assignCallbacks('adopted', target, metadata);
  return true;
}

export function panic(): never {
  throw new Error();
}

function assignCallbacks<T extends TargetCallbacks>(key: PropertyKey, target: TargetConstructor<T>, metadata: object) {
  const method = Reflect.get(target.prototype, key);
  const arr = method ? [method] : [];
  assignArray(metadata, key, arr);
}

function assignObservedAttributes<T extends TargetCallbacks>(target: TargetConstructor<T>, metadata: object) {
  assignArray(metadata, 'observedAttributes', target.observedAttributes);
}

function assignDisabledFeatures<T extends TargetCallbacks>(target: TargetConstructor<T>, metadata: object) {
  assignArray(metadata, 'disabledFeatures', target.disabledFeatures);
}

function assignArray(metadata: object, key: PropertyKey, values?: unknown[]) {
  const value = Reflect.get(metadata, key);
  if (value && Array.isArray(value)) {
    return value.push(...(values ?? []));
  }
  Reflect.set(metadata, key, values ?? []);
}
