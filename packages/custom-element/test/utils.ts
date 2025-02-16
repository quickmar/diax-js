import { CustomElementDecoratorMetadata } from '@diax-js/common/decorator';
import { getElementClass } from '../index';

export class TestTarget {
  static get observedAttributes() {
    return ['test-attribute'];
  }

  static get disabledFeatures() {
    return [];
  }

  init = vi.fn();
  destroy = vi.fn();
  adopt = vi.fn();
}

const metadata: CustomElementDecoratorMetadata = {
  onConnected: [
    function (this: TestTarget) {
      this.init();
    },
  ],
  onDisconnected: [
    function (this: TestTarget) {
      this.destroy();
    },
  ],
  onAdopted: [
    function (this: TestTarget) {
      this.adopt();
    },
  ],
};

export class TestBaseElement extends getElementClass(TestTarget, metadata) {
  static {
    customElements.define('test-base-element', this);
  }

  constructor() {
    super();
  }
}
