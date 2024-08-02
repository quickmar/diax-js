export interface Lockable {
  readonly isLocked: boolean;
  lock(): void;
  unlock(): void;
}

export abstract class SignalLock {}
