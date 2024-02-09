import { useSelf } from '@diax-js/context';
import { ComputationAction, EffectAction, RenderingAction } from './actions';
import { ComputationProcessor, EffectProcessor, RenderingProcessor } from './processors';

export class ActionScheduler {
  private effectProcessor;
  private computationProcessor;
  private renderingProcessor;
  constructor() {
    this.effectProcessor = useSelf(EffectProcessor);
    this.computationProcessor = useSelf(ComputationProcessor);
    this.renderingProcessor = useSelf(RenderingProcessor);
  }

  scheduleEffect(effect: EffectAction): void {
    this.effectProcessor.process(effect);
  }

  scheduleRender(effect: RenderingAction): void {
    this.renderingProcessor.process(effect);
  }

  scheduleComputation(computation: ComputationAction): void {
    this.computationProcessor.process(computation);
  }
}
