import { useSelf } from '@diax-js/context';
import { ComputationSubscription, EffectSubscription } from './subscription';
import { ComputationQueue, EffectQueue } from './queue';

export class ActionScheduler {
  private effectQueue;
  private computationQueue;
  constructor() {
    this.effectQueue = useSelf(EffectQueue);
    this.computationQueue = useSelf(ComputationQueue);
  }

  scheduleEffect(effect: EffectSubscription): void {
    this.effectQueue.schedule(effect);
  }

  scheduleComputation(computation: ComputationSubscription): void {
    this.computationQueue.schedule(computation);
  }
}
