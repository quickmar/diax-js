/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTaskCollector, getCurrentSuite } from 'vitest/suite';
import { CONTEXT, Context } from '@diax-js/common/context';
import { useContext } from '@diax-js/context';
import { getElementClass } from '@diax-js/custom-element';

declare module 'vitest' {
  export interface TestContext {
    [CONTEXT]?: Context;
  }
  export interface TaskContext {
    [CONTEXT]: Context;
  }
}

export async function flush(ms: number = 0): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
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
    const host = new MockContextElement();
    const context = host[CONTEXT];
    const descriptor = Object.getOwnPropertyDescriptor(vitestCtx, CONTEXT);
    if (descriptor) throw new Error('Should not define context');
    Object.assign(vitestCtx, { [CONTEXT]: context });
    useContext(context, () => {
      fn();
    });
  });

  afterEach((vitestCtx) => {
    Object.assign(vitestCtx, { useContext: null, [CONTEXT]: null, MockContextElement: null });
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
      useContext(vitestCtx[CONTEXT], () => {
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

export class MockContextTarget {
  static get observedAttributes() {
    return ['data-unit-test'];
  }
}

export class MockContextElement extends getElementClass(MockContextTarget) {
  static {
    customElements.define('mock-context-element', this);
  }
}
