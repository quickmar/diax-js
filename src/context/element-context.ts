import { Type } from '../model/common';
import { Context, Dependencies } from '../model/context';

export class ElementContext implements Context {
  readonly dependencies: Dependencies = new BaseDependencies();
}

export class BaseDependencies implements Dependencies {
  #dependencies = new Map<Type<unknown>, unknown>();

  getInstance<T>(type: Type<T>): T {
    const instance = this.#dependencies.get(type);
    if (instance === null) throw new ReferenceError(`Cyclic dependency detected! ${type}`);
    if (!instance) throw new ReferenceError(`For type ${type} dependency is not defined`);
    if (!(instance instanceof type)) {
      this.throwNotInstanceOf(type, instance);
    }
    return instance;
  }

  setInstance<T>(type: Type<T>, instance: T | null): void {
    if (!(instance instanceof type) && instance !== null) {
      this.throwNotInstanceOf(type, instance);
    }
    if (!this.#dependencies.has(type)) {
      this.#dependencies.set(type, instance);
    }
  }

  hasInstance<T>(type: Type<T>): boolean {
   return this.#dependencies.has(type);
  }

  private throwNotInstanceOf(type: Type<any>, instance: any): never {
    throw new Error(`${instance} is not instanceof ${type}`);
  }
}
