import { ComputedSignal, Signal } from '@diax-js/common/state';
import { Mock } from 'vitest';
import { getActions, getFirstAction } from './util';
import { computed, signal } from '../src/signals';
import { identity, useMockContext } from '@diax-js/test';

describe('Computed', () => {
  let positive: Signal<number>;
  let negative: Signal<number>;
  let sum: ComputedSignal<number>;
  let spyP: Mock<[number], number>;
  let spyN: Mock<[number], number>;

  beforeAll(() => {
    vi.stubGlobal('requestIdleCallback', vi.fn());
  });

  useMockContext(() => {
    positive = signal(1);
    negative = signal(-1);
    spyP = vi.fn(identity);
    spyN = vi.fn(identity);
    sum = computed(() => spyP(positive.value) + spyN(negative.value));
  });

  it('should be sum', () => {
    expect(sum.value).toBe(0);
    expect(spyP).toBeCalledTimes(1);
    expect(spyN).toBeCalledTimes(1);
  });

  it('should create actions for sources', () => {
    expect(getActions(positive).size).toBe(1);
    expect(getActions(negative).size).toBe(1);
    expect(getFirstAction(positive)).toBe(getFirstAction(negative));
  });

  it('should update computed synchronously', () => {
    positive.setValue(100);
    expect(sum.value).toBe(99);
    negative.setValue(-100);
    expect(sum.value).toBe(0);
  });

  it('should unsubscribe', () => {
    sum.unsubscribe();

    expect(getActions(positive).size).toBe(0);
    expect(getActions(negative).size).toBe(0);
  });

  it('should not update value when unsubscribe', () => {
    const { value } = sum;
    spyN.mockClear();
    spyP.mockClear();
    sum.unsubscribe();

    positive.setValue(10);
    negative.setValue(-3);

    expect(spyP).not.toBeCalled();
    expect(spyN).not.toBeCalled();
    expect(sum.value).toBe(value);
  });

  it('should not recompute when accessing (get) value', () => {
    spyN.mockClear();
    spyP.mockClear();

    sum.value;
    sum.value;

    expect(spyP).not.toBeCalled();
    expect(spyN).not.toBeCalled();
  });
});
