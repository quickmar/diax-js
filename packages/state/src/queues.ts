import { ActionQueue, Action } from '@diax-js/common';
import { ComputationAction, EffectAction } from './actions';

export abstract class AbstractStateQueue<T extends Action> implements ActionQueue<T> {
  protected actions: Set<Action> = new Set();

  abstract schedule(action: T): void;

  protected execute(): void {
    if (this.actions.size === 0) return;
    const actions = this.actions;
    this.actions = new Set();
    for (const action of actions) {
      try {
        action.call();
      } catch (err) {
        reportError(err);
      }
    }
    requestIdleCallback(() => actions.clear());
  }

  protected put(action: T): void {
    this.actions.add(action);
  }
}

export class ComputationQueue extends AbstractStateQueue<ComputationAction> {
  private readonly computationBudged = 1000;
  private currentComputation = 0;

  override schedule(action: ComputationAction): void {
    this.currentComputation++;
    try {
      this.put(action);
      this.execute();
    } catch (error) {
      this.actions.clear();
      throw error;
    } finally {
      this.currentComputation = 0;
    }
  }

  protected override put(action: ComputationAction): void {
    if (this.computationBudged === this.currentComputation) {
      throw new Error('Possible computation cycle detected');
    }
    super.put(action);
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
