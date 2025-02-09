/**
 * Represents an object that can be properly cleaned up or destroyed.
 * Implementing this interface ensures that resources can be released when they are no longer needed.
 * 
 * @interface
 */
export interface Cleanable {
  destroy(): void;
}
