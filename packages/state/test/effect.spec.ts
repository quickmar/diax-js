import { Signal, SubscriptionMode } from '@diax-js/common/state';
import { useMockContext, testInCtx, flush } from '@diax-js/test';
import { getActions, getFirstAction } from './util';
import { signal, effect } from '../src/signals';
import { Mock } from 'vitest';

describe('effect', () => {
  let positive: Signal<number>;
  let negative: Signal<number>;
  let disposables: VoidFunction[];
  let spyP: Mock<[number]>;
  let spyN: Mock<[number]>;

  beforeAll(() => {
    vi.stubGlobal('requestIdleCallback', vi.fn());
  });

  useMockContext(() => {
    positive = signal(1);
    negative = signal(-1);
    spyP = vi.fn();
    spyN = vi.fn();
    disposables = [];
  });

  afterEach(() => {
    while (disposables.length) {
      disposables.pop()?.();
    }
  });

  testInCtx('should subscribe when reading value', () => {
    effectHelper(() => {
      positive.value;
    });

    const actions = getActions(positive);

    expect(actions.size).toBe(1);
    expect([...actions][0].subscriptionMode).toBe(SubscriptionMode.EFFECT);
  });

  testInCtx('should not subscribe', () => {
    effectHelper(() => {
      positive;
    });

    const actions = getActions(positive);

    expect(actions.size).toBe(0);
  });

  testInCtx('should not subscribe when assigning value', () => {
    effectHelper(() => {
      positive.setValue(10);
    });

    const actions = getActions(positive);

    expect(actions.size).toBe(0);
  });

  testInCtx('should create one action for each observable', () => {
    effectHelper(() => {
      positive.value;
      negative.value;
    });

    expect(getFirstAction(positive)).toBe(getFirstAction(negative));
  });

  testInCtx('should call fn when subscribing', async () => {
    effectHelper(() => {
      spyP(positive.value);
    });

    expect(spyP).toBeCalledTimes(1);
    await Promise.resolve();
    expect(spyP).toBeCalledTimes(1);
  });

  testInCtx('should call fn asynchronously', async () => {
    effectHelper(() => {
      spyP(positive.value);
    });
    spyP.mockReset();

    positive.setValue(10);
    expect(spyP).not.toBeCalled();
    await Promise.resolve();

    expect(spyP).toBeCalledTimes(1);
    expect(spyP).toBeCalledWith(10);
  });

  testInCtx('should call once when dependencies change', async () => {
    effectHelper(() => {
      spyP(positive.value);
      spyN(negative.value);
    });
    spyP.mockReset();
    spyN.mockReset();

    positive.setValue(10);
    negative.setValue(-10);
    await Promise.resolve();

    expect(spyP).toBeCalledTimes(1);
    expect(spyN).toBeCalledTimes(1);
    expect(spyP).toBeCalledWith(10);
    expect(spyN).toBeCalledWith(-10);
  });

  testInCtx.skip('should swap values to negative', async () => {
    testNotDuplicating(
      () => {
        positive.setValue(10);
      },
      () => {
        expect(spyP).toBeCalledTimes(1);
        expect(spyN).toBeCalledTimes(1);
        expect(spyP).toBeCalledWith(-10);
        expect(spyN).toBeCalledWith(-10);
      },
    );
  });

  testInCtx.skip('should swap values to positive', async () => {
    testNotDuplicating(
      () => {
        negative.setValue(-10);
      },
      () => {
        expect(spyP).toBeCalledTimes(1);
        expect(spyN).toBeCalledTimes(1);
        expect(spyP).toBeCalledWith(1);
        expect(spyN).toBeCalledWith(1);
      },
    );
  });

  testInCtx('should unsubscribe', async () => {
    const dispose = effect(() => {
      positive.value;
      negative.value;
    });

    dispose();

    expect(getActions(positive).size).toBe(0);
    expect(getActions(negative).size).toBe(0);
  });

  testInCtx('should run twice', async () => {
    await testRunTwice(3);
  });

  testInCtx('should run twice when value not change', async () => {
    await testRunTwice(2);
  });

  function effectHelper(fn: VoidFunction) {
    const dispose = effect(fn);
    disposables.push(dispose);
  }

  async function testRunTwice(secondValue: number) {
    effectHelper(() => {
      spyP(positive.value);
    });
    spyP.mockReset();

    positive.setValue(2);
    await Promise.resolve().then(() => {
      positive.setValue(secondValue);
    });

    await flush();

    expect(spyP).toBeCalledTimes(2);
  }

  async function testNotDuplicating(setValue: VoidFunction, expectations: VoidFunction) {
    effectHelper(() => {
      negative.setValue(-positive.value);
      spyN(negative.value);
    });
    effectHelper(() => {
      positive.setValue(negative.value);
      spyP(positive.value);
    });
    spyP.mockReset();
    spyN.mockReset();

    setValue();
    await Promise.resolve();

    expectations();
  }
});
