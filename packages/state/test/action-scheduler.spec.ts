import { useContext, useSelf, useSupplier } from '@diax-js/context';
import { useMockContext } from '@diax-js/test';
import { ActionScheduler } from '../src/action-scheduler';
import { ComputationProcessor, EffectProcessor } from '../src/processors';

describe('ActionScheduler', () => {
  let mockComputationQueue: ComputationProcessor;
  let mockEffectQueue: EffectProcessor;
  let actionScheduler: ActionScheduler;

  useMockContext(() => {
    mockComputationQueue = useSupplier(ComputationProcessor, () => Object({ process: vi.fn() }));
    mockEffectQueue = useSupplier(EffectProcessor, () => Object({ process: vi.fn() }));
    actionScheduler = useSelf(ActionScheduler);
  }, useContext);

  it('should create', () => {
    expect(actionScheduler).toBeTruthy();
  });

  it('should schedule on computation queue', () => {
    actionScheduler.scheduleComputation(Object({}));

    expect(mockComputationQueue.process).toBeCalledTimes(1);
  });

  it('should schedule on effect queue', () => {
    actionScheduler.scheduleEffect(Object({}));

    expect(mockEffectQueue.process).toBeCalledTimes(1);
  });
});
