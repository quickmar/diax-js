import { NoArgType } from "./common";

export const CONTEXT = Symbol('context');

export interface Context {
  readonly dependencies: Dependencies;
}

export interface Dependencies {
    getInstance<T>(type: NoArgType<T>): T;
    setInstance<T>(type: NoArgType<T>, instance: T | null): void;
    hasInstance<T>(type: NoArgType<T>): boolean;
    removeInstance<T>(type: NoArgType<T>): void;
}