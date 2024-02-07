import { Action, ActionProcessor, SubscriptionMode, newToken } from '@diax-js/common';
import { useDocument, useSupplier } from '@diax-js/context';

export const RENDERING_ACTION_TOKEN = newToken<RenderingAction>('RENDERING_ACTION');

export class RenderProcessor implements ActionProcessor<RenderingAction> {
  private actions: Set<RenderingAction> = new Set();

  constructor() {
    this.execute = this.execute.bind(this);
  }

  process(action: RenderingAction): void {
    this.put(action);
    setTimeout(this.execute);
  }

  private execute(): void {
    if (this.actions.size === 0) return;
    for (const action of this.actions) {
      try {
        action.call();
      } catch (err) {
        reportError(err);
      }
    }
    const actions = this.actions;
    this.actions = new Set();
    requestIdleCallback(() => actions.clear());
  }

  private put(action: RenderingAction): void {
    this.actions.add(action);
  }
}

let renderProcessor: RenderProcessor;

useDocument(() => {
  renderProcessor = useSupplier(RenderProcessor, () => new RenderProcessor());
});

export class RenderingAction implements Action {
  protected close: boolean = false;
  #callable: VoidFunction;

  get call() {
    return this.#callable;
  }
  readonly subscriptionMode: SubscriptionMode;

  constructor(callable: VoidFunction) {
    this.#callable = callable;
    this.subscriptionMode = SubscriptionMode.RENDER;
  }

  unsubscribe(): void {
    if (!this.close) {
      this.#callable = () => {};
      this.close = true;
    }
  }

  schedule(): void {
    renderProcessor.process(this);
  }
}
