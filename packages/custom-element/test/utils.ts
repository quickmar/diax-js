import { HTMLElementCallbacks } from '@diax-js/common';
import { Element } from '../src/element';
import { Mock } from 'vitest';

@Element('test-element')
export class TestElement implements HTMLElementCallbacks {
  static observedAttributes = ['test'];

  spy?: Mock;

  connectedCallback(): void {
    this.spy?.();
  }
  disconnectedCallback(): void {
    this.spy?.();
  }
  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void {
    this.spy?.(name, oldValue, newValue);
  }
  adoptedCallback(): void {
    this.spy?.();
  }
}
