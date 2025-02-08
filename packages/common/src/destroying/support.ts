import { Cleanable } from './model';

/**
 * Represents an action that can be scheduled for execution during idle time.
 * The action can only be scheduled once and subsequent attempts will be ignored.
 */
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

/**
 * Type guard that checks if an object implements the {@link Cleanable} interface.
 * 
 * @param object - The object to check
 * @returns True if the object has a destroy() method, false otherwise
 * 
 * @example
 * ```typescript
 * if (isCleanable(someObject)) {
 *   someObject.destroy();
 * }
 * ```
 */
export function isCleanable(object: unknown): object is Cleanable {
  return !!object && typeof object === 'object' && 'destroy' in object && typeof object['destroy'] === 'function';
}
