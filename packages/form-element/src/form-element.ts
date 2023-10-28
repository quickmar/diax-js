import { FormElementDecorator } from "@diax/common";
import { getFormElementClass } from "./base-form-element";

export function FormElement(tagName: string): FormElementDecorator {
  return function (target) {
    customElements.define(tagName, getFormElementClass(target));
  };
}
