export class ScheduledError extends Error {
  constructor(readonly promise: Promise<unknown>) {
    super('Signal value is not available yet');
  }
}
