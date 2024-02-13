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
