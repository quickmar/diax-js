import { CustomElement, useHost } from '@diax-js/browser';
import { effect } from '@diax-js/browser/state';
import { useCount } from './counter.service';

@CustomElement('counter-output')
class CounterOutput {
  private holder?: HTMLInputElement;

  constructor() {
    this.holder = useHost().querySelector('#holder') ?? undefined;

    effect(() => {
      if (!this.holder) return;
      this.holder.value = String(useCount().count);
    });
  }
}

export default CounterOutput;