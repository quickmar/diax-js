import { Action, SubscriptionMode } from '@diax-js/common/state';
import { useDocument, useSelf } from '@diax-js/context';
import { useHost } from '@diax-js/context/host';
import { ActionScheduler } from './action-scheduler';

let scheduler: ActionScheduler;

useDocument(() => {
  scheduler = useSelf(ActionScheduler);
});

export abstract class AbstractAction implements Action {
  protected close: boolean = false;
  #callable: VoidFunction;

  get call() {
    return this.#callable;
  }
  readonly subscriptionMode: SubscriptionMode;

  constructor(callable: VoidFunction, subscriptionMode: SubscriptionMode) {
    this.#callable = callable;
    this.subscriptionMode = subscriptionMode;
  }

  unsubscribe(): void {
    if (!this.close) {
      this.#callable = () => {};
      this.close = true;
    }
  }

  abstract schedule(): void;
}

export class EffectAction extends AbstractAction {
  constructor(callable: VoidFunction) {
    super(callable, SubscriptionMode.EFFECT);
  }

  override schedule(): void {
    if (!this.close) scheduler.scheduleEffect(this);
  }
}

export class RenderingAction extends AbstractAction {
  readonly host = useHost();

  constructor(callable: VoidFunction) {
    super(callable, SubscriptionMode.RENDER);
  }

  override schedule(): void {
    if (!this.close) scheduler.scheduleRender(this);
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
