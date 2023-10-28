import { ElementDecorator } from '@diax/common';
import { getElementClass } from './base-element';

export function Element(tagName: string): ElementDecorator {
  return function (target) {
    customElements.define(tagName, getElementClass(target));
  };
}
