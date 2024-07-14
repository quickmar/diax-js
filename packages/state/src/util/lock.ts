import { Lockable } from '@diax-js/common/concurrent';

export class CountLock implements Lockable {
  #count = 0;

  get isLocked(): boolean {
    return this.#count !== 0;
  }

  lock(): void {
    this.#count++;
  }

  unlock(): void {
    this.#count--;
  }
}
