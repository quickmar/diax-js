export interface Type<T> {
    new (...args: unknown[]): T;
    prototype: T;
}