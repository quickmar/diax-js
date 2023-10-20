import { RenderingTargetCallbacks, RenderingElementCallbacks, Supplier, TargetConstructor, RenderingElementConstructor } from "@elementy/common";
import { useElement, useSelf } from "@elementy/context";
import { BaseElement } from "@elementy/custom-element";
import { attachRendering } from "./rendering/observing";

export class BaseRenderingElement extends BaseElement<RenderingTargetCallbacks> implements RenderingElementCallbacks {
  static get renderAssociated(): true {
    return true;
  }

  constructor(supplier: Supplier<RenderingTargetCallbacks>) {
    super(supplier);
  }

  render(): void {
    useElement(this, () => {
      this.instance.render();
    });
  }
}

export function getRenderingElementClass(
  target: TargetConstructor<RenderingTargetCallbacks>,
): RenderingElementConstructor {
  return class extends BaseRenderingElement {
    static get observedAttributes() {
      return target.observedAttributes;
    }

    static get target() {
      return target;
    }

    constructor() {
      super(() => {
        attachRendering();
        return useSelf(target);
      });
    }
  };
}
