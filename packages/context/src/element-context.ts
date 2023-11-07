import { Context, Dependencies, TargetCallbacks, Token } from '@diax-js/common';
import { autoAssignToken } from './utils/util';

export class ElementContext<T extends TargetCallbacks> implements Context<T> {
  readonly host: HTMLElement;
  readonly instance: T  = {} as T;
  readonly dependencies: Dependencies = new BaseDependencies();

  constructor(node: HTMLElement) {
    this.host = node;
    this.dependencies.setInstance(autoAssignToken(HTMLElement), node);
  }
}

export class BaseDependencies implements Dependencies {
  #dependencies = new Map<number, unknown>();

  getInstance<T>(token: Token<T>): T {
    const instance = this.#dependencies.get(token.di_index);
    if (instance === null) throw new ReferenceError(`Cyclic dependency detected! ${token.name}`);
    if (!instance) throw new ReferenceError(`For type ${token.name} dependency is not defined`);
    return instance as T;
  }

  setInstance<T>(token: Token<T>, instance: T | null): void {
    if (!this.#dependencies.has(token.di_index)) {
      this.#dependencies.set(token.di_index, instance);
    } else if (instance === null) {
      this.#dependencies.set(token.di_index, null);
    }
  }

  hasInstance<T>(token: Token<T>): boolean {
    return this.#dependencies.has(token.di_index);
  }

  removeInstance<T>(token: Token<T>): void {
    this.#dependencies.delete(token.di_index);
  }
}
