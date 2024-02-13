import { Signal, SubscriptionMode } from '@diax-js/common/state';
import { useMockContext, asAny, testInCtx } from '@diax-js/test';
import { getCurrentContext, useContext } from '@diax-js/context';
import { signal } from '../src/signals';
import { getActions } from './util';

describe('Signal', () => {
  let s: Signal<number>;

  useMockContext(() => {
    s = signal(0);
  }, useContext);

  it('should create', () => {
    expect(s).toBeTruthy();
  });

  it('should has initial value', () => {
    expect(s.value).toBe(0);
  });

  it('should update value', () => {
    s.value = 10;

    expect(s.value).toBe(10);
  });

  it('should schedule dependent actions', () => {
    const actions = getActions(s);
    actions.add(asAny({ schedule: vi.fn() }));
    actions.add(asAny({ schedule: vi.fn() }));

    s.value = 10;

    actions.forEach((action) => {
      expect(action.schedule).toBeCalledTimes(1);
    });
  });

  testInCtx('should not add to observers', () => {
    const context = getCurrentContext();
    context.subscriptionMode = null;

    s.value;

    expect(context.observables.size).toBe(0);
  });

  testInCtx.each([SubscriptionMode.COMPUTED, SubscriptionMode.EFFECT])(
    'should add to observers',
    (subscriptionMode) => {
      const context = getCurrentContext();
      context.subscriptionMode = subscriptionMode as SubscriptionMode;

      s.value;

      expect(context.observables.size).toBe(1);
      expect(Array.from(context.observables)[0]).toBe(s);
    },
  );

  testInCtx.each([SubscriptionMode.COMPUTED, SubscriptionMode.EFFECT])(
    'should add to observers once',
    (subscriptionMode) => {
      const context = getCurrentContext();
      context.subscriptionMode = subscriptionMode as SubscriptionMode;

      s.value;
      s.value;
      s.value;

      expect(context.observables.size).toBe(1);
      expect(Array.from(context.observables)[0]).toBe(s);
    },
  );
});
