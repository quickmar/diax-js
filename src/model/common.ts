export interface NoArgType<T> {
    new (): T;
    prototype: T;
}

export type Supplier<T> = () => T;