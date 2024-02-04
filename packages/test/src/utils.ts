/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CONTEXT,
  Context,
  ContextElement,
  DI_TOKEN,
  Dependencies,
  NoArgType,
  Signal,
  SubscriptionMode,
  TargetCallbacks,
  Token,
  newToken,
} from '@diax-js/common';
import { createTaskCollector, getCurrentSuite } from 'vitest/suite';

export async function flush(ms: number = 0): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function createContextElement(tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = document.createElement(tagName);
  const mockContext = new MockContext();
  mockContext.host = element as HTMLElement;
  return Object.assign(element, { [CONTEXT]: mockContext });
}

export function createContextElementFromString(html: string, tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = createContextElement(tagName);
  element.innerHTML = html;
  for (const node of element.querySelectorAll('[context]')) {
    const mockContext = new MockContext();
    mockContext.host = node as HTMLElement;
    Object.assign(node, { [CONTEXT]: mockContext });
  }
  return element;
}

export class MockDependencies implements Dependencies {
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

export class MockContext implements Context {
  instance: TargetCallbacks = {};
  subscriptionMode: SubscriptionMode | null = null;
  observables: Set<Signal<unknown>> = new Set();
  host: HTMLElement = document.createElement('diax-mock-element');
  dependencies: Dependencies = new MockDependencies();

  constructor() {
    this.dependencies.setInstance(_autoAssignToken(HTMLElement), this.host);
  }
}

const getDiaxCtx = (ctx: any) => {
  return Object.getOwnPropertyDescriptor(ctx, 'diaxCtx')?.value as Context;
};

const hasDiaxCtx = (ctx: any) => {
  return Object.hasOwn(ctx, 'diaxCtx');
};

const assignDiaxCtx = (ctx: any, diaxCtx: Context) => {
  Object.assign(ctx, { diaxCtx });
};

type MockingFn = VoidFunction;

/**
 * Helper function that wrap provided function and run it in {@link beforeEach} hook.
 * This call is wrap in {@link useContext} adding mocked {@link Context}.
 * It let user to do mocking using diax API.
 * After all it tear down diax {@link Context} in {@link afterEach} hook.
 * @param fn callable that do mocking
 */
export function useMockContext(fn: MockingFn, useContext: (context: Context, fn: VoidFunction) => void): void {
  beforeEach((context) => {
    let mockContext = new MockContext();
    if (!hasDiaxCtx(context)) {
      assignDiaxCtx(context, mockContext);
    } else {
      mockContext = getDiaxCtx(context);
    }
    useContext(mockContext, () => {
      fn();
    });
  });

  afterEach((context: any) => {
    delete context.diaxCtx;
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
    handler: (_ctx) => {
      let result;
      // useContext(getDiaxCtx(ctx), () => {
      //   result = fn(ctx);
      // });
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
export function _autoAssignToken<T>(type: NoArgType<T>): Token<T> {
  if (Object.hasOwn(type, DI_TOKEN)) return Object.getOwnPropertyDescriptor(type, DI_TOKEN)?.value;
  const token = newToken(type.name);
  Object.defineProperty(type, DI_TOKEN, {
    value: token,
    configurable: false,
    enumerable: false,
    writable: false,
  });
  return token;
}