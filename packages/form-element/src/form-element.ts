import { FormElementDecorator } from '@diax-js/common/form-element';
import { getFormElementClass } from './base-form-element';

export function FormElement(tagName: string): FormElementDecorator {
  return function (target) {
    customElements.define(tagName, getFormElementClass(target));
  };
}
