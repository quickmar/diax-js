import { CustomElement, useHost } from '@diax-js/browser';
import { effect } from '@diax-js/browser/state';
import { useCount } from './counter.service';
import { AttachShadow, Connected, Disconnected, AttachListener } from '@diax/browser/decorators';

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

  @Connected
  init() {
    console.log('test');
  }

  @Disconnected
  cleanup() {
    console.log('cleanup');
  }

  @AttachListener('dblclick')
  listener(event: UIEvent) {
    console.log(event);
    console.log(this.holder?.value);
  }
}

export default CounterOutput;
