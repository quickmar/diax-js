import { StateQueue, Subscription } from '@diax-js/common';
import { ComputationSubscription } from './subscription';

export class ComputationQueue implements StateQueue<ComputationSubscription> {
  private computations: Set<Subscription> = new Set();

  put(computation: ComputationSubscription): void {
    this.computations.add(computation);
  }

  execute(): void {
    for (const computation of this.computations) {
      computation.callable();
    }
    const computations = this.computations;
    this.computations = new Set();
    requestIdleCallback(() => computations.clear());
  }
}
