import {
  ContextHTMLElement,
  HTMLElementCallbacks,
  HTMLElementConstructor,
  TargetCallbacks,
  TargetConstructor,
} from '../model/elements';

export interface RenderingElementCallbacks extends HTMLElementCallbacks {
}

export interface RenderingHTMLElement extends ContextHTMLElement, RenderingElementCallbacks {}


export interface RenderingTargetCallbacks<R> extends TargetCallbacks {
  render(): R;
}

export interface RenderingElementConstructor<R> extends HTMLElementConstructor<RenderingTargetCallbacks<R>> {
  readonly renderAssociated: true;
}

export type RenderingElementDecorator<R> = <T extends TargetConstructor<RenderingTargetCallbacks<R>>>(
  target: T,
  context: ClassDecoratorContext,
) => void;
