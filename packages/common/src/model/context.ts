import { TargetCallbacks } from "./elements";
import { Token } from "./token";

export const CONTEXT = Symbol.for('@@context');

export interface Context<T extends TargetCallbacks = TargetCallbacks> {
  instance: T;
  readonly host: HTMLElement;
  readonly dependencies: Dependencies;
  readonly contextId: number;
}

export interface Dependencies {
    getInstance<T>(index: Token<T>): T;
    setInstance<T>(index: Token<T>, instance: T | null): void;
    hasInstance<T>(index: Token<T>): boolean;
    removeInstance<T>(index: Token<T>): void;
}