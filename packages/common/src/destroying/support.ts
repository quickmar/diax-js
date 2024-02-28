import { Cleanable } from './model';

export class DestroyAction {
  private closed = false;

  constructor(private callable: VoidFunction) {}

  schedule(): void {
    if (!this.closed) {
      requestIdleCallback(this.callable);
      this.closed = true;
    }
  }
}
export function isCleanable(object: unknown): object is Cleanable {
  return !!object && typeof object === 'object' && 'destroy' in object && typeof object['destroy'] === 'function';
}
