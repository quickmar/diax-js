import { CustomElementDecorator } from '@diax-js/common/custom-element';
import { getElementClass } from './base-element';

export function CustomElement(tagName: string): CustomElementDecorator {
  return function (target) {
    customElements.define(tagName, getElementClass(target));
  };
}
