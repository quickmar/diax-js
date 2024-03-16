import { ACTIONS, Action, Signal, SignalSubscription, SubscriptionMode } from '@diax-js/common/state';
import { RenderingTargetCallbacks, RenderingElementConstructor, RenderingHTMLElement } from '@diax-js/common/rendering';
import { getCurrentContext, useElement, useToken } from '@diax-js/context';
import { RENDERING_ACTION_TOKEN, produceRenderingAction, subscribe } from '@diax-js/state/support';
import { BaseElement } from '@diax-js/custom-element';
import { render, Hole } from 'uhtml';
import { TargetConstructor } from '@diax-js/common/custom-element';
import { Context } from '@diax-js/common/context';
import { DestroyAction } from '@diax-js/common/support';

const diffSets = <T>(a: Set<T>, b: Set<T>) => {
  return new Set([...a].filter((element) => !b.has(element)));
};

const getActions = (signal: Signal<unknown>) => Reflect.get(signal, ACTIONS) as Set<Action>;

const throwSupplier = () => {
  throw new Error('Rendering action must bu supplied to the context.');
};

export abstract class BaseRenderingElement<R>
  extends BaseElement<RenderingTargetCallbacks<R>>
  implements RenderingHTMLElement<R>
{
  static get renderAssociated(): true {
    return true;
  }

  private renderSubscription?: SignalSubscription;
  private previousObservables = new Set<Signal<unknown>>();

  abstract render(result: R): void;

  override connectedCallback(): void {
    super.connectedCallback();
    useElement(this, () => {
      this.renderSubscription = subscribe(() => {
        if (this.renderSubscription) {
          this.onRender();
        } else {
          this.firstRender();
        }
      }, produceRenderingAction);
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.renderSubscription?.unsubscribe();
  }

  private firstRender(): void {
    const context = getCurrentContext();
    const hole = this.instance.render();
    this.previousObservables = new Set(context.observables);
    this.render(hole);
  }

  private onRender(): void {
    const context = getCurrentContext();
    const previousSubscriptionMode = context.subscriptionMode;
    const previousObservables = context.observables;
    context.subscriptionMode = SubscriptionMode.RENDER;
    context.observables = new Set();
    try {
      const hole = this.instance.render();
      this.updateSubscriptions(context);
      this.render(hole);
    } finally {
      context.subscriptionMode = previousSubscriptionMode;
      context.observables = previousObservables;
    }
  }

  private updateSubscriptions(context: Context): void {
    const currentObservables = context.observables;
    const difference = diffSets(currentObservables, this.previousObservables);
    if (difference.size > 0) {
      const renderingAction = useToken(RENDERING_ACTION_TOKEN, throwSupplier);
      for (const observable of difference) {
        getActions(observable).add(renderingAction);
        this.renderSubscription?.add(observable);
      }
      const previousObservables = this.previousObservables;
      new DestroyAction(() => previousObservables.clear()).schedule();
      this.previousObservables = new Set(currentObservables);
    }
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
