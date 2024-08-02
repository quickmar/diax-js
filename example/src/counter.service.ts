import { computed, effect, scheduled, signal } from '@diax-js/state';
import { useDocument, useParent, useSelf } from '@diax-js/context';

export class CounterService {
  #count = signal(0);

  get count() {
    return this.#count.value;
  }

  constructor() {
    const sch = scheduled(() => {
      const value = this.#count.value;

      return new Promise<number>((resolve) => {
        setTimeout(() => resolve(value), 1000);
      });
    });

    const comp = computed(() => {
      return sch.value * 2;
    });

    effect(() => {
      console.log('scheduled', comp.value);
    });
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
