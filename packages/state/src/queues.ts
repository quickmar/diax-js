import { ActionQueue, Action } from '@diax-js/common';
import { ComputationAction, EffectAction } from './actions';

export abstract class AbstractStateQueue<T extends Action> implements ActionQueue<T> {
  protected actions: Set<Action> = new Set();

  abstract schedule(action: T): void;

  protected execute(): void {
    if (this.actions.size === 0) return;
    for (const action of this.actions) {
      try {
        action.call();
      } catch (err) {
        setTimeout(() => {
          throw err;
        });
      }
    }
    const actions = this.actions;
    this.actions = new Set();
    requestIdleCallback(() => actions.clear());
  }

  protected put(action: T): void {
    this.actions.add(action);
  }
}

export class ComputationQueue extends AbstractStateQueue<ComputationAction> {
  override schedule(action: ComputationAction): void {
    this.put(action);
    this.execute();
  }
}

export class EffectQueue extends AbstractStateQueue<EffectAction> {
  constructor() {
    super();
    this.execute = this.execute.bind(this);
  }

  override schedule(action: EffectAction): void {
    this.put(action);
    queueMicrotask(this.execute);
  }
}
