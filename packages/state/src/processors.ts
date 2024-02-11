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
  private currentEffect = 0;

  constructor() {
    super();
    this.execute = this.execute.bind(this);
  }

  protected abstract prepareActions(actions: Set<T>): Iterable<T>;
  protected abstract test(action: T): boolean;

  protected execute(): void {
    if (this.currentEffect === 1) {
      const actions = this.actions;
      this.actions = new Set();
      for (const action of this.prepareActions(actions)) {
        if (this.test(action)) this.callSafe(action);
      }
      requestIdleCallback(() => actions.clear());
    }
    this.currentEffect--;
  }

  protected put(action: T): void {
    this.currentEffect++;
    this.actions.add(action);
  }
}

export class EffectProcessor extends AbstractEffectProcessor<EffectAction> {
  override process(action: EffectAction): void {
    this.put(action);
    queueMicrotask(this.execute);
  }

  protected override prepareActions(actions: Set<EffectAction>): Iterable<EffectAction> {
    // does nothing
    return actions;
  }

  protected override test(_action: EffectAction): boolean {
    return true;
  }
}

export class RenderingProcessor extends AbstractEffectProcessor<RenderingAction> {
  override process(action: RenderingAction): void {
    this.put(action);
    setTimeout(this.execute);
  }

  protected override prepareActions(actions: Set<RenderingAction>): Iterable<RenderingAction> {
    return [...actions].sort(this.topologicalSort);
  }

  protected override test(action: RenderingAction): boolean {
    return action.host.isConnected;
  }

  private topologicalSort(a: RenderingAction, b: RenderingAction): number {
    if (a === b) {
      return 0;
    }
    const position = a.host.compareDocumentPosition(b.host);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
      return -1;
    } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
      return 1;
    } else {
      return 0;
    }
  }
}
