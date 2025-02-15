import { CustomElementDecorator } from '@diax-js/common/custom-element';
import { getElementClass } from './base-element';

export function CustomElement(tagName: string): CustomElementDecorator {
  return function (target, { addInitializer, metadata }) {
    addInitializer(() => {
      customElements.define(tagName, getElementClass(target, metadata));
    });
  };
}
