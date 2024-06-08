import { ContextHTMLElement } from '../context/model';
import { NoArgType } from '../model/common';

/**
 * @description
 * This interface is used to define the disabled features for all elements that are decorated with the `@Element`, `@RenderingElement`, `@FormElement` decorators.
 */
export interface DisabledFeatures {
  readonly disabledFeatures: ('shadow' | 'internals')[];
}
export interface TargetConstructor<T extends TargetCallbacks> extends NoArgType<T> {
  readonly observedAttributes?: string[];
  readonly disabledFeatures?: string[];
}

export interface HTMLElementConstructor<T extends TargetCallbacks>
  extends NoArgType<ContextHTMLElement & HTMLElementCallbacks> {
  readonly target: TargetConstructor<T>;
  readonly observedAttributes?: string[];
  readonly disabledFeatures?: string[];
}

export type TargetCallbacks = Partial<{
  init(): void;
  destroy(): void;
  adopt(): void;
}> &
  object;

export interface HTMLElementCallbacks {
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void;
  adoptedCallback(): void;
}

export type ElementDecorator = <T extends TargetConstructor<TargetCallbacks>>(
  target: T,
  context: ClassDecoratorContext,
) => void;
