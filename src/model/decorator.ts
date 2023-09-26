import { FormElementCallbacks, TargetCallbacks, TargetConstructor } from './elements';

export type ElementDecorator = <T extends TargetConstructor<TargetCallbacks>>(
  target: T,
  context: ClassDecoratorContext,
) => void;

export type FormElementDecorator = <T extends TargetConstructor<FormElementCallbacks>>(
  target: T,
  context: ClassDecoratorContext,
) => void;
