import { CustomElementDecoratorMetadata } from '@diax-js/common/decorator';
import { getElementClass } from '../index';

export class TestTarget {
  static get observedAttributes() {
    return ['test-attribute'];
  }

  static get disabledFeatures() {
    return [];
  }

  connected = vi.fn();
  disconnected = vi.fn();
  adopted = vi.fn();
}

const metadata: CustomElementDecoratorMetadata = {
  connected: [
    function (this: TestTarget) {
      this.connected();
    },
  ],
  disconnected: [
    function (this: TestTarget) {
      this.disconnected();
    },
  ],
  adopted: [
    function (this: TestTarget) {
      this.adopted();
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
