import { StateQueue, Subscription } from '@diax-js/common';
import { ComputationSubscription, EffectSubscription } from './subscription';

export abstract class AbstractStateQueue<T extends Subscription> implements StateQueue<T> {
  protected subscriptions: Set<Subscription> = new Set();

  abstract schedule(subscription: T): void;

  protected execute(): void {
    if (this.subscriptions.size === 0) return;
    for (const subscription of this.subscriptions) {
      try {
        subscription.callable();
      } catch (err) {
        setTimeout(() => {
          throw err;
        });
      }
    }
    const subscriptions = this.subscriptions;
    this.subscriptions = new Set();
    requestIdleCallback(() => subscriptions.clear());
  }

  protected put(subscription: T): void {
    this.subscriptions.add(subscription);
  }
}

export class ComputationQueue extends AbstractStateQueue<ComputationSubscription> {
  override schedule(subscription: ComputationSubscription): void {
    this.put(subscription);
    this.execute();
  }
}

export class EffectQueue extends AbstractStateQueue<EffectSubscription> {
  constructor() {
    super();
    this.execute = this.execute.bind(this);
  }

  override schedule(subscription: EffectSubscription): void {
    this.put(subscription);
    queueMicrotask(this.execute);
  }
}
