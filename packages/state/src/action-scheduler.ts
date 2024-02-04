import { useSelf } from '@diax-js/context';
import { ComputationAction, EffectAction } from './actions';
import { ComputationProcessor, EffectProcessor } from './processors';

export class ActionScheduler {
  private effectProcessor;
  private computationProcessor;
  constructor() {
    this.effectProcessor = useSelf(EffectProcessor);
    this.computationProcessor = useSelf(ComputationProcessor);
  }

  scheduleEffect(effect: EffectAction): void {
    this.effectProcessor.process(effect);
  }

  scheduleComputation(computation: ComputationAction): void {
    this.computationProcessor.process(computation);
  }
}
