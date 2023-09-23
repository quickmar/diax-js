import { ElementDecorator } from '../model/decorator';
import { getBaseClass } from './base-element';

export function Element(tagName: string): ElementDecorator {
  return function (target) {
    customElements.define(tagName, getBaseClass(target));
  };
}
