import { TargetCallbacks, TargetConstructor } from '@diax-js/common/custom-element';
import { FormElement, FormElementCallbacks, FormElementConstructor } from '@diax-js/common/form-element';
import { useElement, useSupplier } from '@diax-js/context';
import { BaseElement, extendMetadata, panic } from '@diax-js/custom-element';

export abstract class BaseFormElement<T extends TargetCallbacks>
  extends BaseElement<T>
  implements FormElementCallbacks, FormElement
{
  static get formAssociated(): true {
    return true;
  }

  #internals!: ElementInternals;

  constructor() {
    super();
    useElement(this, () => {
      this.#internals = useSupplier(ElementInternals, () => this.attachInternals());
    });
  }
  get name(): string {
    return this.getAttribute('name') ?? '';
  }
  get type(): string {
    return this.localName;
  }
  get form(): HTMLFormElement | null {
    return this.#internals.form;
  }
  get validity(): ValidityState {
    return this.#internals.validity;
  }
  get validationMessage(): string {
    return this.#internals.validationMessage;
  }
  get willValidate(): boolean {
    return this.#internals.willValidate;
  }
  checkValidity(): boolean {
    return this.#internals.checkValidity();
  }
  reportValidity(): boolean {
    return this.#internals.reportValidity();
  }
  formAssociatedCallback(form: HTMLFormElement): void {
    useElement(this, () => {
      // TODO: Implement formAssociatedCallback
    });
  }
  formDisabledCallback(disabled: boolean): void {
    useElement(this, () => {
      // TODO: Implement formDisabledCallback
    });
  }
  formResetCallback(): void {
    useElement(this, () => {
      // TODO: Implement formResetCallback
    });
  }
  formStateRestoreCallback(state: unknown, reason: 'autocomplete' | 'restore'): void {
    useElement(this, () => {
      // TODO: Implement formStateRestoreCallback
    });
  }
}

export function getFormElementClass<T extends TargetCallbacks>(
  target: TargetConstructor<T>,
  metadata?: DecoratorMetadataObject,
): FormElementConstructor<T> {
  metadata = metadata ?? {};
  if (!extendMetadata(target, metadata)) {
    panic();
  }
  return class extends BaseFormElement<T> {
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
