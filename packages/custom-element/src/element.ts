import { ElementDecorator } from '@diax-js/common';
import { getElementClass } from './base-element';

export function Element(tagName: string): ElementDecorator {
  return function (target) {
    customElements.define(tagName, getElementClass(target));
  };
}
