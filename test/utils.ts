import { Element, FormElement } from '../main';
import { CONTEXT } from '../src/context/context';
import { ElementContext } from '../src/context/element-context';
import { ContextElement, FormElementCallbacks, HTMLElementCallbacks } from '../src/model/elements';

@Element('test-element')
export class TestElement implements HTMLElementCallbacks {
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
}

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

export function createContextElement(tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = document.createElement(tagName);
  return Object.assign(element, { [CONTEXT]: new ElementContext(element) });
}

export function createContextElementFromString(html: string, tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = createContextElement(tagName);
  element.innerHTML = html;
  for (const node of element.querySelectorAll('[context]')) {
    Object.assign(element, { [CONTEXT]: new ElementContext(node) });
  }
  return element;
}
