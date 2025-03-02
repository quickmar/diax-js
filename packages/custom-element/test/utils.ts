import { CustomElementDecoratorMetadata } from '@diax-js/common/decorator';
import { getElementClass } from '../index';

export class TestTarget {
  static get observedAttributes() {
    return ['test-attribute'];
  }

  static get disabledFeatures() {
    return [];
  }

  _connected = vi.fn();
  _disconnected = vi.fn();
  _adopted = vi.fn();

  connected() {
    this._connected();
  }

  disconnected() {
    this._disconnected();
  }

  adopted() {
    this._adopted();
  }
}

export class TestBaseElement extends getElementClass(TestTarget) {
  static {
    customElements.define('test-base-element', this);
  }
}
