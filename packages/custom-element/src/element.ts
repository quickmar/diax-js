import { ElementDecorator } from '@diax-js/common/custom-element';
import { getElementClass } from './base-element';

export function Element(tagName: string): ElementDecorator {
  return function (target) {
    customElements.define(tagName, getElementClass(target));
  };
}
