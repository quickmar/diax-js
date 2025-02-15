import { getFormElementClass } from './base-form-element';
import { CustomElementDecorator } from '@diax-js/common/decorator';

export function FormElement(tagName: string): CustomElementDecorator {
  return function (target, { addInitializer, metadata }) {
    addInitializer(() => {
      customElements.define(tagName, getFormElementClass(target, metadata));
    });
  };
}
