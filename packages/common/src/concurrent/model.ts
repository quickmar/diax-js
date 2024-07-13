export interface Lockable {
    readonly isLocked: boolean;
    lock(): void;
    unlock(): void;
}