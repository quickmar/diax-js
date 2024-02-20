/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTaskCollector, getCurrentSuite } from 'vitest/suite';
import { CONTEXT, Context, ContextHTMLElement, Dependencies, Token } from '@diax-js/common/context';
import { Signal, Subscription, SubscriptionMode } from '@diax-js/common/src/state/model';
import { TargetCallbacks } from '@diax-js/common/src/custom-element/model';

declare module 'vitest' {
  export interface TestContext {
    [CONTEXT]?: MockContext;
    useContext: (ctx: Context, fn: VoidFunction) => void;
  }
  export interface TaskContext {
    [CONTEXT]: MockContext;
    useContext: (ctx: Context, fn: VoidFunction) => void;
  }
}

export async function flush(ms: number = 0): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class MockDependencies implements Dependencies {
  #dependencies = new Map<number, unknown>();

  getInstance<T>(token: Token<T>): T {
    return this.#dependencies.get(token.di_index) as T;
  }

  setInstance<T>(token: Token<T>, instance: T | null): void {
    this.#dependencies.set(token.di_index, instance);
  }

  hasInstance<T>(token: Token<T>): boolean {
    return this.#dependencies.has(token.di_index);
  }

  removeInstance<T>(token: Token<T>): void {
    this.#dependencies.delete(token.di_index);
  }

  destroy(): void {
    this.#dependencies.clear();
  }
}

export class MockContext implements Context {
  instance: TargetCallbacks = {};
  subscriptionMode: SubscriptionMode | null = null;
  observables: Set<Signal<unknown>> = new Set();
  dependencies: Dependencies = new MockDependencies();
  attributes: Readonly<Record<string, Signal<string>>> = {};
  ownedSubscriptions: Set<Subscription> = new Set();
  host: HTMLElement;

  constructor(host: HTMLElement) {
    this.host = host;
  }

  destroy(): void {}
}

type MockingFn = VoidFunction;

/**
 * Helper function that wrap provided function and run it in {@link beforeEach} hook.
 * This call is wrap in {@link useContext} adding mocked {@link Context}.
 * It let user to do mocking using diax API.
 * After all it tear down diax {@link Context} in {@link afterEach} hook.
 * @param fn callable that do mocking
 */
export function useMockContext(fn: MockingFn): void {
  beforeEach((vitestCtx) => {
    let mockContext = new MockContextElement()[CONTEXT];
    const descriptor = Object.getOwnPropertyDescriptor(vitestCtx, CONTEXT);
    if (!descriptor) {
      Object.assign(vitestCtx, { [CONTEXT]: mockContext });
    } else {
      mockContext = descriptor.value;
    }
    vitestCtx.useContext(mockContext, () => {
      fn();
    });
  });

  afterEach((vitestCtx) => {
    vitestCtx[CONTEXT].destroy();
    Object.assign(vitestCtx, { useContext: null, [CONTEXT]: null });
  });
}

/**
 * Equivalent to {@link test} or {@link it} but runs in {@link useContext}.
 * Use it wit {@link useMockContext}
 */
export const testInCtx = createTaskCollector(function (this: any, name, fn, timeout) {
  getCurrentSuite().task(name, {
    ...this,
    meta: {
      customPropertyToDifferentiateTask: true,
    },
    handler: (vitestCtx) => {
      let result;
      vitestCtx.useContext(vitestCtx[CONTEXT], () => {
        result = fn(vitestCtx);
      });
      return result;
    },
    timeout,
  });
});

export function asAny<T>(obj: T): any {
  return obj;
}

export function identity<T>(value: T): T {
  return value;
}

export class MockContextElement extends HTMLElement implements ContextHTMLElement {
  static {
    customElements.define('mock-context-element', this);
  }

  [CONTEXT]: Context<TargetCallbacks>;

  constructor(context?: Context) {
    super();
    this[CONTEXT] = context ?? new MockContext(this);
  }
}
