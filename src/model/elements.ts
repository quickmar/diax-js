import { CONTEXT } from '../context/context';
import { FormElement } from '../form-element/form-element';
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

export interface FormElementCallbacks extends HTMLElementCallbacks {
  formAssociatedCallback(form: HTMLFormElement): void;
  formDisabledCallback(disabled: boolean): void;
  formResetCallback(): void;
  formStateRestoreCallback(state: unknown, reason: 'autocomplete' | 'restore'): void;
}

export interface RenderingElementCallbacks extends HTMLElementCallbacks {
  render(): void;
}

export interface FormElement
  extends Pick<
    ElementInternals,
    'form' | 'validity' | 'validationMessage' | 'willValidate' | 'checkValidity' | 'reportValidity'
  > {
  readonly name: string;
  readonly type: string;
}

export type TargetCallbacks = Partial<HTMLElementCallbacks> & object;
export type FormTargetCallbacks = Partial<FormElementCallbacks> & object;
export type RenderingTargetCallbacks = TargetCallbacks & Pick<RenderingElementCallbacks, 'render'>;

export interface HTMLElementConstructor<T extends TargetCallbacks> extends NoArgType<HTMLElement> {
  readonly target: TargetConstructor<T>;
  readonly observedAttributes?: string[];
}

export interface FormElementConstructor extends NoArgType<HTMLElement & FormElement & FormElementCallbacks> {
  readonly target: TargetConstructor<FormTargetCallbacks>;
  readonly formAssociated: true;
}

export interface RenderingElementConstructor extends HTMLElementConstructor<RenderingTargetCallbacks> {
  readonly renderAssociated: true;
}

export interface TargetConstructor<T extends TargetCallbacks> extends NoArgType<T> {
  readonly observedAttributes?: string[];
}
