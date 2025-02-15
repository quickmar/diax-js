import { getFormElementClass } from './base-form-element';
import { CustomElementDecorator } from '@diax-js/common/custom-element';

export function FormElement(tagName: string): CustomElementDecorator {
  return function (target, { addInitializer, metadata }) {
    addInitializer(() => {
      customElements.define(tagName, getFormElementClass(target, metadata));
    });
  };
}
