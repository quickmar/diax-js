import { TargetConstructor } from '@diax-js/common/custom-element';
import { FormElement, FormElementCallbacks, FormElementConstructor } from '@diax-js/common/form-element';
import { CustomElementDecoratorMetadata } from '@diax-js/common/decorator';
import { useElement, useSupplier } from '@diax-js/context';
import { BaseElement } from '@diax-js/custom-element';

export abstract class BaseFormElement<T> extends BaseElement<T> implements FormElementCallbacks, FormElement {
  static get formAssociated(): true {
    return true;
  }

  #internals!: ElementInternals;

  constructor(metadata: CustomElementDecoratorMetadata) {
    super(metadata);
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

export function getFormElementClass<T>(
  target: TargetConstructor<T>,
  metadata: CustomElementDecoratorMetadata,
): FormElementConstructor {
  return class extends BaseFormElement<T> {
    static get observedAttributes() {
      return target.observedAttributes;
    }

    get target() {
      return target;
    }

    get metadata() {
      return metadata;
    }

    constructor() {
      super(metadata);
    }
  };
}
