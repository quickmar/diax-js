import { useContext, useSelf, useSupplier } from '@diax-js/context';
import { useMockContext } from '@diax-js/test';
import { ActionScheduler } from '../src/action-scheduler';
import { ComputationProcessor, EffectProcessor, RenderingProcessor } from '../src/processors';

describe('ActionScheduler', () => {
  let mockComputationProcessor: ComputationProcessor;
  let mockEffectProcessor: EffectProcessor;
  let mockRenderingProcessor: RenderingProcessor;
  let actionScheduler: ActionScheduler;

  useMockContext(() => {
    mockComputationProcessor = useSupplier(ComputationProcessor, () => Object({ process: vi.fn() }));
    mockEffectProcessor = useSupplier(EffectProcessor, () => Object({ process: vi.fn() }));
    mockRenderingProcessor = useSupplier(RenderingProcessor, () => Object({ process: vi.fn() }));
    actionScheduler = useSelf(ActionScheduler);
  }, useContext);

  it('should create', () => {
    expect(actionScheduler).toBeTruthy();
  });

  it('should process computation', () => {
    actionScheduler.scheduleComputation(Object({}));

    expect(mockComputationProcessor.process).toBeCalledTimes(1);
  });

  it('should process effect', () => {
    actionScheduler.scheduleEffect(Object({}));

    expect(mockEffectProcessor.process).toBeCalledTimes(1);
  });

  it('should process render', () => {
    actionScheduler.scheduleRender(Object({}));

    expect(mockRenderingProcessor.process).toBeCalledTimes(1);
  });
});
