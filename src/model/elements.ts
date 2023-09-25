import { CONTEXT } from '../context/context';
import { NoArgType } from './common';
import { Context } from './context';

export interface ContextNode extends Node {
  readonly [CONTEXT]: Context;
}

export interface ContextElement extends Element {
  readonly [CONTEXT]: Context;
}

export interface ContextHTMLElement extends HTMLElement {
  readonly [CONTEXT]: Context;
}

export interface HTMLElementCallbacks {
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown): void;
  adoptedCallback(): void;
}

export type TargetCallbacks = Partial<HTMLElementCallbacks> & object;

export interface HTMLElementConstructor extends NoArgType<HTMLElement> {
  get observedAttributes(): string[];
  get target(): TargetConstructor;
}

export interface TargetConstructor extends NoArgType<TargetCallbacks> {
  readonly observedAttributes?: string[];
}
