import { DestroyAction, isCleanable } from '@diax-js/common/support';
import { Context, Dependencies, Token } from '@diax-js/common/context';
import { Signal, Subscription } from '@diax-js/common/state';
import { BaseHTMLElement, TargetCallbacks } from '@diax-js/common/custom-element';

const initAttributes = (observedAttributes: string[]) => {
  return Object.preventExtensions(
    observedAttributes.reduce((record, attribute) => Object.assign(record, { [attribute]: null }), {}),
  ) as Record<string, Signal<string>>;
};

export class ElementContext implements Context {
  #host: WeakRef<BaseHTMLElement<TargetCallbacks>>;
  #attributes: Record<string, Signal<string> | null> | null = null;
  dependencies: Dependencies = new BaseDependencies();
  observables = new Set<Signal<unknown>>();
  subscriptionMode = null;
  ownedSubscriptions: Set<Subscription> = new Set();

  constructor(node: BaseHTMLElement<TargetCallbacks>) {
    this.#host = new WeakRef(node);
  }

  get host(): BaseHTMLElement<TargetCallbacks> {
    const host = this.#host.deref();
    if (!host) throw new ReferenceError('Host element is not available');
    return host;
  }

  get observedAttributes(): Set<string> {
    return new Set(this.host.metadata.observedAttributes);
  }

  get attributes(): Record<string, Signal<string> | null> {
    if (!this.#attributes) {
      this.#attributes = initAttributes([...this.observedAttributes]);
    }
    return this.#attributes;
  }

  destroy(): void {
    const { dependencies, ownedSubscriptions } = this;
    this.dependencies = new BaseDependencies();
    this.ownedSubscriptions = new Set();
    dependencies.destroy();
    new DestroyAction(() => {
      for (const subscription of ownedSubscriptions) {
        subscription.unsubscribe();
      }
      ownedSubscriptions.clear();
      dependencies.destroy();
    }).schedule();
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

  destroy(): void {
    for (const [_, dependency] of this.#dependencies) {
      if (isCleanable(dependency)) {
        dependency.destroy();
        for (const key of Object.getOwnPropertyNames(dependency)) {
          Reflect.set(dependency, key, null);
        }
      }
    }
    this.#dependencies.clear();
  }
}
