import { RenderingElementDecorator } from "@diax-js/common/rendering";
import { getRenderingElementClass } from "./base-rendering-element";
import { Hole } from "uhtml";

export function RenderingElement(tagName: string): RenderingElementDecorator<Hole> {
    return function (target) {
      customElements.define(tagName, getRenderingElementClass(target));
    };
  }