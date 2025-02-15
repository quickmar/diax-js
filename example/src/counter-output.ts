import { CustomElement, useHost } from '@diax-js/browser';
import { effect } from '@diax-js/browser/state';
import { useCount } from './counter.service';
import { AttachShadow, PostConnect, PreDisconnect } from '@diax/browser/decorators';

@CustomElement('counter-output')
// @AttachShadow()
class CounterOutput {
  private holder?: HTMLInputElement;

  constructor() {
    console.log('CounterOutput created');
    this.holder = useHost().querySelector('#holder') ?? undefined;

    effect(() => {
      if (!this.holder) return;
      this.holder.value = String(useCount().count);
    });
  }

  @PostConnect
  init() {
    console.log('test');
  }

  @PreDisconnect
  cleanup() {
    console.log('cleanup');
  }
}

export default CounterOutput;
