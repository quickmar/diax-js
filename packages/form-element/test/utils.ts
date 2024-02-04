import { HTMLElementCallbacks, FormElementCallbacks } from '@diax-js/common';
import { FormElement } from '../src/form-element';

@FormElement('test-form-element')
export class TestFormElement implements HTMLElementCallbacks, FormElementCallbacks {
  static observedAttributes = ['test'];

  spy = vi.fn();

  connectedCallback(): void {
    this.spy();
  }
  disconnectedCallback(): void {
    this.spy();
  }
  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
    this.spy(name, oldValue, newValue);
  }
  adoptedCallback(): void {
    this.spy();
  }
  formAssociatedCallback(form: HTMLFormElement): void {
    this.spy(form);
  }
  formDisabledCallback(disabled: boolean): void {
    this.spy(disabled);
  }
  formResetCallback(): void {
    this.spy();
  }
  formStateRestoreCallback(state: unknown, reason: 'autocomplete' | 'restore'): void {
    this.spy(state, reason);
  }
}
