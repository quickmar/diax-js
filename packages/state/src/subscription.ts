import { Subscription, SubscriptionMode } from '@diax-js/common';
import { ActionScheduler } from './action-scheduler';
import { useDocument, useSelf } from '@diax-js/context';

let scheduler: ActionScheduler;

useDocument(() => {
  scheduler = useSelf(ActionScheduler);
});

export abstract class AbstractSubscription implements Subscription {
  private isStopped: boolean = false;

  readonly subscriptionMode: SubscriptionMode;
  #callable: VoidFunction;
  get callable() {
    return this.#callable;
  }

  constructor(callable: VoidFunction, subscriptionMode: SubscriptionMode) {
    this.#callable = callable;
    this.subscriptionMode = subscriptionMode;
  }

  clear(): void {
    if (!this.isStopped) {
      this.#callable = () => {};
      this.isStopped = true;
    }
  }

  abstract schedule(): void;
}

export class EffectSubscription extends AbstractSubscription {
  constructor(callable: VoidFunction) {
    super(callable, SubscriptionMode.EFFECT);
  }

  override schedule(): void {
    scheduler.scheduleEffect(this);
  }
}

export class ComputationSubscription extends AbstractSubscription {
  constructor(callable: VoidFunction) {
    super(callable, SubscriptionMode.COMPUTED);
  }

  override schedule(): void {
    scheduler.scheduleComputation(this);
  }
}
