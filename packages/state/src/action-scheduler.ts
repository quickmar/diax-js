import { useSelf } from '@diax-js/context';
import { Subscription } from '@diax-js/common';
import { EffectQueue } from './effect-queue';
import { ComputationQueue } from './computation-queue';
import { ComputationSubscription, EffectSubscription } from './subscription';

export class ActionScheduler {
  private effectQueue: EffectQueue;
  private computationQueue: ComputationQueue;
  constructor() {
    this.effectQueue = useSelf(EffectQueue);
    this.computationQueue = useSelf(ComputationQueue);
  }

  schedule(subscriptions: Iterable<Subscription>) {
    for (const subscription of subscriptions) {
      subscription.schedule();
    }
  }

  scheduleEffect(effect: EffectSubscription): void {
    this.effectQueue.put(effect);
  }

  scheduleComputation(computation: ComputationSubscription): void {
    this.computationQueue.put(computation);
    this.computationQueue.execute();
  }
}
