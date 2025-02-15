import { getElementClass } from '../index';

export class TestTarget {
  static get observedAttributes() {
    return ['test-target'];
  }

  static get disabledFeatures() {
    return [];
  }

  init = vi.fn();
  destroy = vi.fn();
  adopt = vi.fn();
}

export class TestBaseElement extends getElementClass(TestTarget, { observedAttributes: ['test-attribute'] }) {
  static {
    customElements.define('test-base-element', this);
  }
}
