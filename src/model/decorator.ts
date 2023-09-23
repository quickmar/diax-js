import { TargetConstructor } from './elements';

export type ElementDecorator = <T extends TargetConstructor>(target: T, context: ClassDecoratorContext) => T | void;
