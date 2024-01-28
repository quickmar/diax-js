import { useSelf, useSupplier } from '@diax-js/context';
import { ActionScheduler } from '../src/action-scheduler';
import { useMockContext } from './util';
import { ComputationQueue, EffectQueue } from '../src/queues';

describe('ActionScheduler', () => {
  let mockComputationQueue: ComputationQueue;
  let mockEffectQueue: EffectQueue;
  let actionScheduler: ActionScheduler;

  useMockContext(() => {
    mockComputationQueue = useSupplier(ComputationQueue, () => Object({ schedule: vi.fn() }));
    mockEffectQueue = useSupplier(EffectQueue, () => Object({ schedule: vi.fn() }));
    actionScheduler = useSelf(ActionScheduler);
  });

  it('should create', () => {
    expect(actionScheduler).toBeTruthy();
  });

  it('should schedule on computation queue', () => {
    actionScheduler.scheduleComputation(Object({}));

    expect(mockComputationQueue.schedule).toBeCalledTimes(1);
  });

  it('should schedule on effect queue', () => {
    actionScheduler.scheduleEffect(Object({}));

    expect(mockEffectQueue.schedule).toBeCalledTimes(1);
  });
});
