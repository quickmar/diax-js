import { SignalSubscription } from '@diax-js/common/state';
import { RenderingTargetCallbacks, RenderingHTMLElement, RenderingElementConstructor } from '@diax-js/common/rendering';
import { useElement } from '@diax-js/context';
import { produceRenderingAction, subscribe } from '@diax-js/state/support';
import { BaseElement, extendsMetadata } from '@diax-js/custom-element';
import { render, Hole } from 'uhtml';
import { TargetConstructor } from '@diax-js/common/custom-element';
import { CustomElementDecoratorMetadata } from '@diax-js/common/decorator';

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
    const { component } = this;
    if (!component) {
      return;
    }
    useElement(this, () => {
      this.renderSubscription = subscribe(() => this.render(component.render()), produceRenderingAction);
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.renderSubscription?.unsubscribe();
  }
}

export function getRenderingElementClass(
  target: TargetConstructor<RenderingTargetCallbacks<Hole>>,
  metadata?: CustomElementDecoratorMetadata,
): RenderingElementConstructor<Hole> {
  metadata = extendsMetadata(target, metadata ?? {});
  
  return class extends BaseRenderingElement<Hole> {
    static get observedAttributes() {
      return metadata.observedAttributes;
    }

    static get disabledFeatures() {
      return metadata.disabledFeatures;
    }

    get target() {
      return target;
    }

    get metadata() {
      return metadata;
    }

    override render(result: Hole): void {
      render(this, result);
    }
  };
}
