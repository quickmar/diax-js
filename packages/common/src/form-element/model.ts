import { HTMLElementCallbacks, HTMLElementConstructor, TargetCallbacks, TargetConstructor } from '../custom-element/model';

/**
 * Represents callbacks for form-associated custom elements.
 * Extends the base HTMLElement callbacks with form-specific lifecycle methods.
 * 
 * @interface FormElementCallbacks
 * @extends HTMLElementCallbacks
 * 
 * @see {@link https://html.spec.whatwg.org/multipage/custom-elements.html#form-associated-custom-elements}
 */
export interface FormElementCallbacks extends HTMLElementCallbacks {
  formAssociatedCallback(form: HTMLFormElement): void;
  formDisabledCallback(disabled: boolean): void;
  formResetCallback(): void;
  formStateRestoreCallback(state: unknown, reason: 'autocomplete' | 'restore'): void;
}

/**
 * Represents a form element with validation capabilities.
 * This interface combines essential form-related properties and methods from ElementInternals
 * with basic form element attributes.
 * 
 * @interface FormElement
 * @property {string} name - The name of the form element
 * @property {string} type - The type of the form element
 * @property {HTMLFormElement | null} form - The form that the element is associated with
 * @property {ValidityState} validity - The ValidityState object representing the validation state
 * @property {string} validationMessage - The validation message for the element
 * @property {boolean} willValidate - Indicates if the element will be validated
 * @property {() => boolean} checkValidity - Method to check if the element meets validation constraints
 * @property {() => boolean} reportValidity - Method to check validity and display validation message
 */
export interface FormElement
  extends Pick<
    ElementInternals,
    'form' | 'validity' | 'validationMessage' | 'willValidate' | 'checkValidity' | 'reportValidity'
  > {
  readonly name: string;
  readonly type: string;
}

/**
 * Represents a combination of form element callbacks and target callbacks.
 * Creates a type that includes optional form element callbacks merged with target callbacks.
 * 
 * @template FormElementCallbacks - The type containing form element-specific callback methods
 * @template TargetCallbacks - The type containing target-specific callback methods
 */
export type FormTargetCallbacks = Partial<FormElementCallbacks> & TargetCallbacks;

/**
 * Constructor interface for form-associated custom elements.
 * Extends HTMLElementConstructor with form-specific callbacks and enforces form association.
 * 
 * @interface
 * @extends {HTMLElementConstructor<FormTargetCallbacks>}
 * @property {true} formAssociated - Indicates that the element will participate in form submission.
 * This property must be declared as `static` in implementing classes.
 */
export interface FormElementConstructor
  extends HTMLElementConstructor<FormTargetCallbacks> {
  readonly formAssociated: true;
}

export type FormElementDecorator = <T extends TargetConstructor<FormTargetCallbacks>>(
  target: T,
  context: ClassDecoratorContext,
) => void;
