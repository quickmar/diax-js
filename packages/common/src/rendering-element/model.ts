import { ContextHTMLElement } from '../context/model';
import { HTMLElementConstructor, TargetConstructor } from '../custom-element/model';

/**
 * {@link RenderingHTMLElement} is a object that defines callback for any rendering HTMLElement.
 * Main method is render that accept result of some template function and apply it result to it self.
 */
export interface RenderingHTMLElement<R> extends ContextHTMLElement {
  render(result: R): void;
}

/**
 * {@link RenderingTargetCallbacks} is a object that defines callback for any rendering {@link Target}.
 * Main method is render that must return result of some template function.
 */
export interface RenderingTargetCallbacks<R> {
  render(): R;
}

/**
 * {@link RenderingElementConstructor} is a object that defines constructor for any rendering HTMLElement.
 * It extends {@link HTMLElementConstructor} and adds {@link RenderingTargetCallbacks} to it.
 */
export interface RenderingElementConstructor<R> extends HTMLElementConstructor<RenderingHTMLElement<R>> {}

/**
 * {@link RenderingElementDecorator} is a function that defines decorator for any rendering {@link RenderingTargetCallbacks}.
 * It let create new {@link RenderingElementConstructor} based on provided {@link TargetConstructor} of {@link RenderingElementCallbacks}.
 */
export type RenderingElementDecorator<R> = <T extends TargetConstructor<RenderingTargetCallbacks<R>>>(
  target: T,
  context: ClassDecoratorContext,
) => void;
