import { Signal, SubscriptionMode } from '@diax-js/common/state';
import { useMockContext, testInCtx, flush } from '@diax-js/test';
import { useContext } from '@diax-js/context';
import { getActions, getFirstAction } from './util';
import { signal, useEffect } from '../src/signals';
import { Mock } from 'vitest';

describe('useEffect', () => {
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
  }, useContext);

  afterEach(() => {
    while (disposables.length) {
      disposables.pop()?.();
    }
  });

  testInCtx('should subscribe when reading value', () => {
    useEffectHelper(() => {
      positive.value;
    });

    const actions = getActions(positive);

    expect(actions.size).toBe(1);
    expect([...actions][0].subscriptionMode).toBe(SubscriptionMode.EFFECT);
  });

  testInCtx('should not subscribe', () => {
    useEffectHelper(() => {
      positive;
    });

    const actions = getActions(positive);

    expect(actions.size).toBe(0);
  });

  testInCtx('should not subscribe when assigning value', () => {
    useEffectHelper(() => {
      positive.value = 10;
    });

    const actions = getActions(positive);

    expect(actions.size).toBe(0);
  });

  testInCtx('should create one action for each observable', () => {
    useEffectHelper(() => {
      positive.value;
      negative.value;
    });

    expect(getFirstAction(positive)).toBe(getFirstAction(negative));
  });

  testInCtx('should call fn when subscribing', async () => {
    useEffectHelper(() => {
      spyP(positive.value);
    });

    expect(spyP).toBeCalledTimes(1);
    await Promise.resolve();
    expect(spyP).toBeCalledTimes(1);
  });

  testInCtx('should call fn asynchronously', async () => {
    useEffectHelper(() => {
      spyP(positive.value);
    });
    spyP.mockReset();

    positive.value = 10;
    expect(spyP).not.toBeCalled();
    await Promise.resolve();

    expect(spyP).toBeCalledTimes(1);
    expect(spyP).toBeCalledWith(10);
  });

  testInCtx('should call once when dependencies change', async () => {
    useEffectHelper(() => {
      spyP(positive.value);
      spyN(negative.value);
    });
    spyP.mockReset();
    spyN.mockReset();

    positive.value = 10;
    negative.value = -10;
    await Promise.resolve();

    expect(spyP).toBeCalledTimes(1);
    expect(spyN).toBeCalledTimes(1);
    expect(spyP).toBeCalledWith(10);
    expect(spyN).toBeCalledWith(-10);
  });

  testInCtx('should swap values to negative', async () => {
    testNotDuplicating(
      () => {
        positive.value = 10;
      },
      () => {
        expect(spyP).toBeCalledTimes(1);
        expect(spyN).toBeCalledTimes(1);
        expect(spyP).toBeCalledWith(-10);
        expect(spyN).toBeCalledWith(-10);
      },
    );
  });

  testInCtx('should swap values to positive', async () => {
    testNotDuplicating(
      () => {
        negative.value = -10;
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
    const dispose = useEffect(() => {
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

  function useEffectHelper(fn: VoidFunction) {
    const dispose = useEffect(fn);
    disposables.push(dispose);
  }

  async function testRunTwice(secondValue: number) {
    useEffectHelper(() => {
      spyP(positive.value);
    });
    spyP.mockReset();

    positive.value = 2;
    await Promise.resolve().then(() => {
      positive.value = secondValue;
    });

    await flush();

    expect(spyP).toBeCalledTimes(2);
  }

  async function testNotDuplicating(setValue: VoidFunction, expectations: VoidFunction) {
    useEffectHelper(() => {
      spyN((negative.value = -positive.value));
    });
    useEffectHelper(() => {
      spyP((positive.value = negative.value));
    });
    spyP.mockReset();
    spyN.mockReset();

    setValue();
    await Promise.resolve();

    expectations();
  }
});
