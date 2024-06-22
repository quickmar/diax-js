import { SignalSubscription } from '@diax-js/common/state';
import { RenderingTargetCallbacks, RenderingElementConstructor, RenderingHTMLElement } from '@diax-js/common/rendering';
import { useElement } from '@diax-js/context';
import { produceRenderingAction, subscribe } from '@diax-js/state/support';
import { BaseElement } from '@diax-js/custom-element';
import { render, Hole } from 'uhtml';
import { TargetConstructor } from '@diax-js/common/custom-element';

export abstract class BaseRenderingElement<R>
  extends BaseElement<RenderingTargetCallbacks<R>>
  implements RenderingHTMLElement<R>
{
  static get renderAssociated(): true {
    return true;
  }

  private renderSubscription?: SignalSubscription;

  abstract render(result: R): void;

  override connectedCallback(): void {
    super.connectedCallback();
    useElement(this, () => {
      this.renderSubscription = subscribe(() => this.render(this.instance.render()), produceRenderingAction);
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.renderSubscription?.unsubscribe();
  }
}

export function getRenderingElementClass(
  target: TargetConstructor<RenderingTargetCallbacks<Hole>>,
): RenderingElementConstructor<Hole> {
  return class extends BaseRenderingElement<Hole> {
    static get observedAttributes() {
      return target.observedAttributes;
    }

    static get target() {
      return target;
    }

    override render(result: Hole): void {
      render(this, result);
    }
  };
}
