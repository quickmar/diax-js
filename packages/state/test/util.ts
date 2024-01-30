/* eslint-disable @typescript-eslint/no-explicit-any */
import { ACTIONS, Action, Context, Dependencies, Signal, SubscriptionMode, TargetCallbacks } from '@diax-js/common';
import { BaseDependencies, autoAssignToken, useContext } from '@diax-js/context';
import { createTaskCollector, getCurrentSuite } from 'vitest/suite';

class MockContext implements Context {
  instance: TargetCallbacks = {};
  subscriptionMode: SubscriptionMode | null = null;
  observables: Set<Signal<unknown>> = new Set();
  host: HTMLElement = document.createElement('diax-mock-element');
  dependencies: Dependencies = new BaseDependencies();

  constructor() {
    this.dependencies.setInstance(autoAssignToken(HTMLElement), this.host);
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
export function useMockContext(fn: MockingFn): void {
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
    handler: (ctx) => {
      let result;
      useContext(getDiaxCtx(ctx), () => {
        result = fn(ctx);
      });
      return result;
    },
    timeout,
  });
});

export function asAny<T>(obj: T): any {
  return obj;
}

export async function flush(ms: number = 0): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function getActions(signal: Signal<unknown>): Set<Action> {
  return Reflect.get(signal, ACTIONS);
}

export function identity<T>(value: T): T {
  return value;
}

export function getFirstAction(sig: Signal<unknown>): Action {
  return [...getActions(sig)][0];
}
