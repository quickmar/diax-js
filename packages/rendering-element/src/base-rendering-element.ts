import { ACTIONS, Action, Signal, SignalSubscription, SubscriptionMode } from '@diax-js/common/state';
import {
  RenderingTargetCallbacks,
  RenderingElementCallbacks,
  RenderingElementConstructor,
} from '@diax-js/common/rendering';
import { getCurrentContext, useElement, useToken } from '@diax-js/context';
import { RENDERING_ACTION_TOKEN, produceRenderingAction, subscribe } from '@diax-js/state/support';
import { BaseElement } from '@diax-js/custom-element';
import { render, Hole } from 'uhtml';
import { TargetConstructor } from '@diax-js/common/custom-element';

const difference = <T>(a: Set<T>, b: Set<T>) => {
  return new Set([...a].filter((element) => !b.has(element)));
};

const getActions = (signal: Signal<unknown>) => Reflect.get(signal, ACTIONS) as Set<Action>;

const throwSupplier = () => {
  throw new Error('Rendering action must bu supplied to the context.');
};

export class BaseRenderingElement
  extends BaseElement<RenderingTargetCallbacks<Hole>>
  implements RenderingElementCallbacks
{
  static get renderAssociated(): true {
    return true;
  }

  private renderSubscription?: SignalSubscription;
  private previousObservables = new Set<Signal<unknown>>();

  override connectedCallback(): void {
    super.connectedCallback();
    useElement(this, () => {
      this.renderSubscription = subscribe(() => {
        if (this.renderSubscription) {
          this.render();
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
    render(this, hole);
  }

  private render(): void {
    const context = getCurrentContext();
    const previousSubscriptionMode = context.subscriptionMode;
    const previousObservables = context.observables;
    const renderingAction = useToken(RENDERING_ACTION_TOKEN, throwSupplier);
    context.subscriptionMode = SubscriptionMode.RENDER;
    context.observables = new Set();
    try {
      const hole = this.instance.render();
      const currentObservables = context.observables;
      const diff = difference(currentObservables, this.previousObservables);
      this.updateSubscriptions(diff, renderingAction, currentObservables);
      render(this, hole);
    } finally {
      context.subscriptionMode = previousSubscriptionMode;
      context.observables = previousObservables;
    }
  }

  private updateSubscriptions(
    difference: Set<Signal<unknown>>,
    renderingAction: ReturnType<typeof produceRenderingAction>,
    currentObservables: Set<Signal<unknown>>,
  ): void {
    if (difference.size > 0) {
      for (const observable of difference) {
        getActions(observable).add(renderingAction);
        this.renderSubscription?.add(observable);
      }
      this.previousObservables = new Set(currentObservables);
    }
  }
}

export function getRenderingElementClass(
  target: TargetConstructor<RenderingTargetCallbacks<Hole>>,
): RenderingElementConstructor<Hole> {
  return class extends BaseRenderingElement {
    static get observedAttributes() {
      return target.observedAttributes;
    }

    static get target() {
      return target;
    }
  };
}
