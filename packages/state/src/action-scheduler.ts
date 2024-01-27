import { useSelf } from '@diax-js/context';
import { ComputationAction, EffectAction } from './subscription';
import { ComputationQueue, EffectQueue } from './queue';

export class ActionScheduler {
  private effectQueue;
  private computationQueue;
  constructor() {
    this.effectQueue = useSelf(EffectQueue);
    this.computationQueue = useSelf(ComputationQueue);
  }

  scheduleEffect(effect: EffectAction): void {
    this.effectQueue.schedule(effect);
  }

  scheduleComputation(computation: ComputationAction): void {
    this.computationQueue.schedule(computation);
  }
}
