import { ACTIONS, Action, Signal, SubscriptionMode, Supplier, TargetConstructor } from '@diax-js/common';
import {
  RenderingTargetCallbacks,
  RenderingElementCallbacks,
  RenderingElementConstructor,
} from '@diax-js/common/rendering';
import { getCurrentContext, useElement, useSelf, useToken } from '@diax-js/context';
import { subscribe } from '@diax-js/state/support';
import { BaseElement } from '@diax-js/custom-element';
import { attachRendering } from './rendering/observing';
import { render } from './rendering/rendering';
import { Hole } from 'uhtml';
import { RENDERING_ACTION_TOKEN, RenderingAction } from './rendering/rendering-action';

const diff = <T>(a: Set<T>, b: Set<T>) => {
  return new Set([...a].filter((element) => !b.has(element)));
};

const getActions = (signal: Signal<unknown>) => Reflect.get(signal, ACTIONS) as Set<Action>;

export class BaseRenderingElement
  extends BaseElement<RenderingTargetCallbacks<Hole>>
  implements RenderingElementCallbacks
{
  static get renderAssociated(): true {
    return true;
  }

  private disposeRender?: VoidFunction;
  private previousObservables = new Set<Signal<unknown>>();

  constructor(supplier: Supplier<RenderingTargetCallbacks<Hole>>) {
    super(supplier);
  }

  override connectedCallback(): void {
    useElement(this, () => {
      this.disposeRender = subscribe(
        () => {
          let renderResult;
          const context = getCurrentContext();
          if (this.disposeRender) {
            const previousSubscriptionMode = context.subscriptionMode;
            const previousObservables = context.observables;
            const renderingAction = useToken(RENDERING_ACTION_TOKEN, () => {
              throw new Error('Should be defined!');
            });
            renderingAction;
            context.subscriptionMode = SubscriptionMode.RENDER;
            context.observables = new Set();
            try {
              renderResult = this.instance.render().result;
              const currentObservables = context.observables;
              const difference = diff(this.previousObservables, currentObservables);
              for (const observable of difference) {
                getActions(observable).delete(renderingAction);
              }
              for (const observable of currentObservables) {
                getActions(observable).add(renderingAction);
              }
              this.previousObservables = new Set(currentObservables);
            } finally {
              context.subscriptionMode = previousSubscriptionMode;
              context.observables = previousObservables;
            }
          } else {
            renderResult = this.instance.render().result;
            this.previousObservables = new Set(context.observables);
          }

          render(this, renderResult!);
        },
        (c) => useToken(RENDERING_ACTION_TOKEN, () => new RenderingAction(c)),
      );
    });
    super.connectedCallback();
  }

  render(): void {
    // useElement(this, () => {
    //   // subscribe()
    //   const { result } = this.instance.render();
    //   result && render(this, result);
    // });
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

    constructor() {
      super(() => {
        attachRendering();
        return useSelf(target);
      });
    }
  };
}
