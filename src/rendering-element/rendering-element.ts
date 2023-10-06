import { RenderingElementDecorator } from "../model/decorator";
import { getRenderingElementClass } from "./base-rendering-element";

export function RenderingElement(tagName: string): RenderingElementDecorator {
    return function (target) {
      customElements.define(tagName, getRenderingElementClass(target));
    };
  }