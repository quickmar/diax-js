import { RenderingElementCallbacks } from '@diax-js/common';
import { RenderingElement } from '../src/rendering-element';

@RenderingElement('test-rendering-element')
export class TestRenderingElement implements RenderingElementCallbacks {
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

  render(): void {
    this.spy();
  }
}
