import { RenderingElement } from '@diax-js/rendering-element';
import { html } from '@diax-js/rendering-element/uhtml';
import { CounterService, useCount } from './counter.service';
import { computed, effect } from '@diax/state';

@RenderingElement('my-counter')
export class Counter {
  private countService: CounterService = useCount();

  constructor() {
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    const com = computed(() => this.countService.scheduled);
    effect(() => {
      console.log('scheduled', com.value);
    });
  }

  increment() {
    this.countService.increment();
  }

  decrement() {
    this.countService.decrement();
  }

  render() {
    return html`
      <button @click=${this.decrement}>-</button>
      <button @click=${this.increment}>+</button>
    `;
  }
}
