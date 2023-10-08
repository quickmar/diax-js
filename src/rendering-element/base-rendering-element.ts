import { useElement } from '../context/use-element';
import { useSelf } from '../context/use-self';
import { BaseElement } from '../element/base-element';
import { Supplier } from '../model/common';
import {
  RenderingElementCallbacks,
  RenderingElementConstructor,
  RenderingTargetCallbacks,
  TargetConstructor,
} from '../model/elements';

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
        return useSelf(target);
      });
    }
  };
}
