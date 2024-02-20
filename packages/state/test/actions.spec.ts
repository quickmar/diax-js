import { useDocument, useSelf } from '@diax-js/context';
import { Action, SubscriptionMode } from '@diax-js/common/state';
import { ComputationProcessor, EffectProcessor, RenderingProcessor } from '../src/processors';
import { ComputationAction, EffectAction, RenderingAction } from '../src/actions';
import { MockInstance } from 'vitest';

describe('Actions', () => {
  let computationProcessor: MockInstance<[ComputationAction], void>;
  let effectProcessor: MockInstance<[EffectAction], void>;
  let renderingProcessor: MockInstance<[RenderingAction], void>;

  beforeAll(() => {
    useDocument(() => {
      const computation = useSelf(ComputationProcessor);
      const effect = useSelf(EffectProcessor);
      const render = useSelf(RenderingProcessor);
      computationProcessor = vi.spyOn(computation, 'process');
      effectProcessor = vi.spyOn(effect, 'process');
      renderingProcessor = vi.spyOn(render, 'process');
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
      case SubscriptionMode.RENDER:
        return renderingProcessor;
    }
  }
});
