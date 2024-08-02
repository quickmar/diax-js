import { scheduled, signal } from '@diax-js/state';
import { useDocument, useParent, useSelf } from '@diax-js/context';

const flush = <T>(val: T, time: number = 1000) =>
  new Promise<T>((resolve) => {
    setTimeout(() => resolve(val), time);
  });

export class CounterService {
  #count = signal(0);
  #scheduled = scheduled(async () => {
    return await flush(this.#count.value);
  });
  #scheduled1 = scheduled(async () => {
    return await flush(this.#scheduled.value, 2000);
  });

  get count() {
    return this.#count.value;
  }

  get scheduled() {
    return this.#scheduled.value;
  }

  get scheduled1() {
    return this.#scheduled1.value;
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
