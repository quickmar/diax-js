import { Action, SubscriptionMode } from '@diax-js/common/state';
import { Lockable } from '@diax-js/common/concurrent';
import { useDocument, useSelf } from '@diax-js/context';
import { useHost } from '@diax-js/context/host';
import { ActionScheduler } from './action-scheduler';

let scheduler: ActionScheduler;

useDocument(() => {
  scheduler = useSelf(ActionScheduler);
});

export abstract class AbstractAction implements Action, Lockable {
  protected close: boolean = false;
  protected isLocked: boolean = false;
  #callable: VoidFunction;

  get call() {
    return this.#callable;
  }

  readonly subscriptionMode: SubscriptionMode;

  constructor(callable: VoidFunction, subscriptionMode: SubscriptionMode) {
    this.#callable = callable;
    this.subscriptionMode = subscriptionMode;
  }

  lock(): void {
    if (this.close) return;
    this.isLocked = true;
  }
  
  unlock(): void {
    if (this.close) return;
    this.isLocked = false;
  }

  unsubscribe(): void {
    if (!this.close) {
      this.#callable = () => {};
      this.close = true;
      this.isLocked = true;
    }
  }

  abstract schedule(): void;
}

export class EffectAction extends AbstractAction {
  constructor(callable: VoidFunction) {
    super(callable, SubscriptionMode.EFFECT);
  }

  override schedule(): void {
    if (!this.close && !this.isLocked) scheduler.scheduleEffect(this);
  }
}

export class RenderingAction extends AbstractAction {
  readonly host = useHost();

  constructor(callable: VoidFunction) {
    super(callable, SubscriptionMode.RENDER);
  }

  override schedule(): void {
    if (!this.close && !this.isLocked) scheduler.scheduleRender(this);
  }
}

export class ComputationAction extends AbstractAction {
  constructor(callable: VoidFunction) {
    super(callable, SubscriptionMode.COMPUTED);
  }

  override schedule(): void {
    if (!this.close) scheduler.scheduleComputation(this);
  }
}
