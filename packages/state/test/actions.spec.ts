import { useDocument, useSelf } from '@diax-js/context';
import { ComputationQueue, EffectQueue } from '../src/queues';
import { ComputationAction, EffectAction } from '../src/actions';
import { Action, SubscriptionMode } from '@diax-js/common';
import { MockInstance } from 'vitest';

describe('Actions', () => {
  let computationSchedule: MockInstance<[ComputationAction], void>;
  let effectSchedule: MockInstance<[EffectAction], void>;

  beforeAll(() => {
    useDocument(() => {
      const computationQueue = useSelf(ComputationQueue);
      const effectQueue = useSelf(EffectQueue);
      computationSchedule = vi.spyOn(computationQueue, 'schedule');
      effectSchedule = vi.spyOn(effectQueue, 'schedule');
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe.each([
    [EffectAction, SubscriptionMode.EFFECT],
    [ComputationAction, SubscriptionMode.COMPUTED],
  ])('Action', (ActionCtor, subscriptionMode) => {
    let action: Action;
    let callable: VoidFunction;

    beforeEach(() => {
      callable = vi.fn();
      action = new ActionCtor(callable);
    });

    it('should create', () => {
      expect(action).toBeTruthy();
    });

    it('should has subscription mode', () => {
      expect(action.subscriptionMode).toBe(subscriptionMode);
    });

    it('should call', () => {
      action.call();

      expect(callable).toBeCalledTimes(1);
    });

    it('should put on the queue', () => {
      const scheduleSpy = getQueueSpy(subscriptionMode);
      scheduleSpy.mockImplementationOnce(() => {});

      action.schedule();

      expect(scheduleSpy).toBeCalledTimes(1);
    });

    it('should unsubscribe', () => {
      action.unsubscribe();

      action.call();

      expect(callable).not.toBeCalled();
    });

    it('should not put on the queue', () => {
      const scheduleSpy = getQueueSpy(subscriptionMode);
      scheduleSpy.mockImplementationOnce(() => {});
      action.unsubscribe();

      action.schedule();

      expect(scheduleSpy).not.toBeCalled();
    });
  });

  function getQueueSpy(subscriptionMode: SubscriptionMode) {
    switch (subscriptionMode) {
      case SubscriptionMode.COMPUTED:
        return computationSchedule;
      case SubscriptionMode.EFFECT:
        return effectSchedule;
    }
  }
});
