import { ActionProcessor as IActionProcessor, Action } from '@diax-js/common/state';
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

abstract class AbstractEffectProcessor<T extends Action> extends ActionProcessor<T> {
  protected actions: Set<T> = new Set();
  protected actionCounter = 0;

  constructor() {
    super();
    this.execute = this.execute.bind(this);
  }

  protected put(action: T): void {
    this.actionCounter++;
    this.actions.add(action);
  }

  protected reassignActions(): void {
    const actions = this.actions;
    this.actions = new Set();
    requestIdleCallback(() => actions.clear());
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

export class EffectProcessor extends AbstractEffectProcessor<EffectAction> {
  protected override execute(): void {
    if (this.actionCounter === 1) {
      for (const action of this.actions) {
        this.callSafe(action);
      }
      this.reassignActions();
    }
    this.actionCounter--;
  }

  override process(action: EffectAction): void {
    this.put(action);
    queueMicrotask(this.execute);
  }
}

export class RenderingProcessor extends AbstractEffectProcessor<RenderingAction> {
  private isRendering: boolean = false;

  protected override put(action: RenderingAction): void {
    if (this.isRendering) {
      this.isRendering = false;
      throw new Error(`Detected state change or RenderingAction request while page is rendering.`);
    }
    super.put(action);
  }

  protected override execute(): void {
    if (this.actionCounter === 1) {
      this.isRendering = true;
      for (const action of [...this.actions].sort(this.topologicalSort)) {
        if (action.host.isConnected) this.callSafe(action);
      }
      this.reassignActions();
      this.isRendering = false;
    }
    this.actionCounter--;
  }

  override process(action: RenderingAction): void {
    this.put(action);
    setTimeout(this.execute);
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
