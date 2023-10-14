export interface NoArgType<T> {
    new (): T;
    prototype: T;
}

export interface Type<T> {
    new (...args: unknown[]): T;
    prototype: T;
}

export type Supplier<T> = () => T;