import { RenderingElement } from '@diax-js/rendering-element';
import { html } from '@diax-js/rendering-element/uhtml';
import { CounterService, useCount } from './counter.service';

@RenderingElement('my-counter')
export class Counter {
  private countService: CounterService = useCount();

  constructor() {
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
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
