import { BaseElement } from '../element/base-element';
import { useElement, useSelf, useSupplier } from '../elements';
import {
  FormElement,
  FormElementCallbacks,
  FormElementConstructor,
  FormTargetCallbacks,
  TargetConstructor,
} from '../model/elements';

export class BaseFormElement extends BaseElement<FormTargetCallbacks> implements FormElementCallbacks, FormElement {
  static get formAssociated(): true {
    return true;
  }

  #internals!: ElementInternals;

  constructor(ctor: TargetConstructor<FormTargetCallbacks>) {
    super(ctor);
    useElement(this, () => {
      this.#internals = useSupplier(ElementInternals, () => {
        return useSelf(HTMLElement).attachInternals();
      });
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
    return this.#internals?.validity;
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
      this.instance.formAssociatedCallback?.(form);
    });
  }
  formDisabledCallback(disabled: boolean): void {
    useElement(this, () => {
      this.instance.formDisabledCallback?.(disabled);
    });
  }
  formResetCallback(): void {
    useElement(this, () => {
      this.instance.formResetCallback?.();
    });
  }
  formStateRestoreCallback(state: unknown, reason: 'autocomplete' | 'restore'): void {
    useElement(this, () => {
      this.instance.formStateRestoreCallback?.(state, reason);
    });
  }
}

export function getFormElementClass(target: TargetConstructor<FormTargetCallbacks>): FormElementConstructor {
  return class extends BaseFormElement {
    static get observedAttributes() {
      return target.observedAttributes;
    }

    static get target() {
      return target;
    }

    constructor() {
      super(target);
    }
  };
}
