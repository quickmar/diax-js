import { useDocument, useSelf } from '@diax-js/context';
import { Action, SubscriptionMode } from '@diax-js/common/state';
import { ComputationProcessor, EffectProcessor } from '../src/processors';
import { ComputationAction, EffectAction } from '../src/actions';
import { MockInstance } from 'vitest';

describe('Actions', () => {
  let computationProcessor: MockInstance<[ComputationAction], void>;
  let effectProcessor: MockInstance<[EffectAction], void>;

  beforeAll(() => {
    useDocument(() => {
      const computationQueue = useSelf(ComputationProcessor);
      const effectQueue = useSelf(EffectProcessor);
      computationProcessor = vi.spyOn(computationQueue, 'process');
      effectProcessor = vi.spyOn(effectQueue, 'process');
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

    it('should put on the processor', () => {
      const scheduleSpy = getProcessorSpy(subscriptionMode);
      scheduleSpy.mockImplementationOnce(() => {});

      action.schedule();

      expect(scheduleSpy).toBeCalledTimes(1);
    });

    it('should unsubscribe', () => {
      action.unsubscribe();

      action.call();

      expect(callable).not.toBeCalled();
    });

    it('should not put on the processor', () => {
      const scheduleSpy = getProcessorSpy(subscriptionMode);
      scheduleSpy.mockImplementationOnce(() => {});
      action.unsubscribe();

      action.schedule();

      expect(scheduleSpy).not.toBeCalled();
    });
  });

  function getProcessorSpy(subscriptionMode: SubscriptionMode) {
    switch (subscriptionMode) {
      case SubscriptionMode.COMPUTED:
        return computationProcessor;
      case SubscriptionMode.EFFECT:
        return effectProcessor;
    }
  }
});
