import { ActionProcessor as IActionProcessor, Action } from '@diax-js/common';
import { ComputationAction, EffectAction, RenderingAction } from './actions';

export abstract class ActionProcessor<T extends Action> implements IActionProcessor<T> {
  abstract process(action: T): void;

  protected abstract execute(): void;

  protected abstract put(action: T): void;

  protected callSafe(action: T) {
    try {
      action.call();
    } catch (err) {
      reportError(err);
    }
  }
}

export class ComputationProcessor extends ActionProcessor<ComputationAction> {
  private readonly computationBudged = 1000;
  private currentComputation = 0;

  private currentAction: ComputationAction | null = null;

  override process(action: ComputationAction): void {
    const previousAction = this.currentAction;
    try {
      this.put(action);
      this.execute();
    } finally {
      this.currentComputation = 0;
      this.currentAction = previousAction;
    }
  }

  protected override put(action: ComputationAction): void {
    this.currentComputation++;
    if (this.computationBudged === this.currentComputation) {
      throw new RangeError(`Computation budged (${this.computationBudged}) exceeded.`);
    }
    this.currentAction = action;
  }

  protected override execute(): void {
    if (this.currentAction) {
      this.callSafe(this.currentAction);
    }
    this.currentComputation--;
  }
}

abstract class AbstractEffectProcessor<T extends Action> extends ActionProcessor<T> {
  private actions: Set<T> = new Set();

  constructor() {
    super();
    this.execute = this.execute.bind(this);
  }

  protected execute(): void {
    if (this.actions.size === 0) return;
    for (const action of this.actions) {
      this.callSafe(action);
    }
    const actions = this.actions;
    this.actions = new Set();
    requestIdleCallback(() => actions.clear());
  }

  protected put(action: T): void {
    this.actions.add(action);
  }
}

export class EffectProcessor extends AbstractEffectProcessor<EffectAction> {
  override process(action: EffectAction): void {
    this.put(action);
    queueMicrotask(this.execute);
  }
}

export class RenderingProcessor extends AbstractEffectProcessor<RenderingAction> {
  override process(action: EffectAction): void {
    this.put(action);
    setTimeout(this.execute);
  }
}
