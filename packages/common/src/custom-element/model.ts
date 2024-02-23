import { ContextHTMLElement } from '../context/model';
import { NoArgType } from '../model/common';

export interface TargetConstructor<T extends TargetCallbacks> extends NoArgType<T> {
  readonly observedAttributes?: string[];
}

export interface HTMLElementConstructor<T extends TargetCallbacks> extends NoArgType<ContextHTMLElement> {
  readonly target: TargetConstructor<T>;
  readonly observedAttributes?: string[];
}

export type TargetCallbacks = Partial<HTMLElementCallbacks> & object;

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
