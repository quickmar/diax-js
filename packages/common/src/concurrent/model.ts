/**
 * Represents an object that can be locked and unlocked.
 * 
 * An object implementing this interface can be in one of two states:
 * locked or unlocked, as indicated by the `isLocked` property.
 * 
 * @interface
 * 
 * @property {boolean} isLocked - Indicates whether the object is currently locked.
 * @method lock - Sets the object to a locked state.
 * @method unlock - Sets the object to an unlocked state.
 */
export interface Lockable {
    readonly isLocked: boolean;
    lock(): void;
    unlock(): void;
}