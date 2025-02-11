import { signal } from '@diax-js/browser/state';
import { useDocument, useParent, useSelf } from '@diax-js/browser';

export class CounterService {
  #count = signal(0);

  get count() {
    return this.#count.value;
  }

  increment() {
    const value = this.#count.value;
    this.#count.setValue(value + 1);
  }

  decrement() {
    const value = this.#count.value;
    this.#count.setValue(value - 1);
  }
}

useDocument(() => {
  useSelf(CounterService);
});

export function useCount() {
  const instance = useParent(CounterService);
  if (!instance) throw new Error('useCount must be used within the context of a CounterService');
  return instance;
}
