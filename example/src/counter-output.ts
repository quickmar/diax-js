import { CustomElement } from '@diax/custom-element';
import { useHost } from '@diax-js/context/host';
import { effect } from '@diax-js/state';
import { useCount } from './counter.service';

@CustomElement('counter-output')
export class CounterOutput {
  private holder?: HTMLInputElement;

  constructor() {
    this.holder = useHost().querySelector('#holder') ?? undefined;

    effect(() => {
      if (!this.holder) return;
      this.holder.value = String(useCount().count);
    });
  }
}
