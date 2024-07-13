export class Queue<T> {
  private queue: T[] = [];

  enqueue(item: T) {
    this.queue.push(item);
  }

  dequeue(): T {
    const item = this.queue.shift();
    if (!item) {
      throw new Error('Queue is empty');
    }
    return item;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  sorted(compareFn: Parameters<Array<T>['sort']>[0]): this {
    this.queue.sort(compareFn);
    return this;
  }
}
