import { html, RenderingElement } from "@diax-js/browser";
import { computed, effect } from "@diax-js/browser/state";
import { CounterService, useCount } from "./counter.service";


@RenderingElement('my-counter')
class Counter {
  private countService: CounterService = useCount();

  constructor() {
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    const com = computed(() => this.countService.count);
    effect(() => {
      console.log('count', this.countService.count, com.value);
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

export default Counter;