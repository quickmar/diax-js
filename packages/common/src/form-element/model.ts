import { HTMLElementCallbacks, HTMLElementConstructor, TargetCallbacks, TargetConstructor } from '../custom-element/model';

export interface FormElementCallbacks extends HTMLElementCallbacks {
  formAssociatedCallback(form: HTMLFormElement): void;
  formDisabledCallback(disabled: boolean): void;
  formResetCallback(): void;
  formStateRestoreCallback(state: unknown, reason: 'autocomplete' | 'restore'): void;
}

export interface FormElement
  extends Pick<
    ElementInternals,
    'form' | 'validity' | 'validationMessage' | 'willValidate' | 'checkValidity' | 'reportValidity'
  > {
  readonly name: string;
  readonly type: string;
}

export type FormTargetCallbacks = Partial<FormElementCallbacks> & TargetCallbacks;

export interface FormElementConstructor
  extends HTMLElementConstructor<FormTargetCallbacks> {
  readonly formAssociated: true;
}

export type FormElementDecorator = <T extends TargetConstructor<FormTargetCallbacks>>(
  target: T,
  context: ClassDecoratorContext,
) => void;
