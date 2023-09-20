import { Type } from "./common";

export interface Context {
  readonly dependencies: Dependencies;
}

export interface Dependencies {
    getInstance<T>(type: Type<T>): T;
    setInstance<T>(type: Type<T>, instance: T | null): void;
    hasInstance<T>(type: Type<T>): boolean;
}