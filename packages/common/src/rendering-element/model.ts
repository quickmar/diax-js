import { ContextHTMLElement } from '../context/model';
import {
  HTMLElementCallbacks,
  HTMLElementConstructor,
  TargetCallbacks,
  TargetConstructor,
} from '../custom-element/model';

export interface RenderingElementCallbacks extends HTMLElementCallbacks {}

export interface RenderingHTMLElement<R> extends ContextHTMLElement, RenderingElementCallbacks {
  render(result: R): void;
}

export interface RenderingTargetCallbacks<R> extends TargetCallbacks {
  render(): R;
}

export interface RenderingElementConstructor<R> extends HTMLElementConstructor<RenderingTargetCallbacks<R>> {}

export type RenderingElementDecorator<R> = <T extends TargetConstructor<RenderingTargetCallbacks<R>>>(
  target: T,
  context: ClassDecoratorContext,
) => void;
