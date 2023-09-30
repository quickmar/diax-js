import { FormTargetCallbacks, TargetCallbacks, TargetConstructor } from './elements';

export type ElementDecorator = <T extends TargetConstructor<TargetCallbacks>>(
  target: T,
  context: ClassDecoratorContext,
) => void;

export type FormElementDecorator = <T extends TargetConstructor<FormTargetCallbacks>>(
  target: T,
  context: ClassDecoratorContext,
) => void;
