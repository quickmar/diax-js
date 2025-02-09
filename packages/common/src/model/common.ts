/**
 * Represents a type that can be instantiated without arguments.
 * This interface is typically used for type constraints where a class needs to be instantiated with a no-argument constructor.
 * 
 * @template T - The type of instance that will be created
 * 
 * @property {new () => T} - Constructor signature that creates new instances of T without arguments
 * @property {T} prototype - The prototype of the type T
 */
export interface NoArgType<T> {
    new (): T;
    prototype: T;
}

/**
 * Represents a constructor type that can create instances of type T.
 * 
 * @template T - The type of object that this constructor creates
 * @property {new (...args: unknown[]) => T} constructor - Constructor signature that accepts any number of arguments
 * @property {T} prototype - The prototype of the constructed object
 */
export interface Type<T> {
    new (...args: unknown[]): T;
    prototype: T;
}

/**
 * Represents a function that supplies/produces a value of type T.
 * Similar to Java's Supplier interface, this type defines a function that takes no arguments
 * and returns a value of type T.
 * 
 * @template T The type of the value being supplied
 * @returns A value of type T
 */
export type Supplier<T> = () => T;