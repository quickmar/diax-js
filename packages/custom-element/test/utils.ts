import { TargetCallbacks } from '@diax-js/common/custom-element';
import { getElementClass } from '../index';

export class TestTarget implements TargetCallbacks {
  static get observedAttributes() {
    return ['test-target'];
  }

  static get disabledFeatures() {
    return ['shadow', 'internals'];
  }

  init = vi.fn();
  destroy = vi.fn();
  adopt = vi.fn();
}

export class TestBaseElement extends getElementClass(TestTarget) {
  static {
    customElements.define('test-base-element', this);
  }
}
