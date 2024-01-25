import { StateQueue, Subscription } from '@diax-js/common';
import { EffectSubscription } from './subscription';

export class EffectQueue implements StateQueue<EffectSubscription> {
  private effects: Set<Subscription> = new Set();

  constructor() {
    this.execute = this.execute.bind(this);
  }

  put(effect: EffectSubscription): void {
    this.effects.add(effect);
    queueMicrotask(this.execute);
  }

  execute(): void {
    if (this.effects.size === 0) return;
    for (const effect of this.effects) {
      try {
        effect.callable();
      } catch (err) {
        setTimeout(() => {
          throw err;
        });
      }
    }
    const effects = this.effects;
    this.effects = new Set();
    requestIdleCallback(() => effects.clear());
  }
}
