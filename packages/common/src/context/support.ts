import { Token } from "./model";


/**
 * A dependency injection index counter used for tracking the order of dependencies.
 * Generated using the IndexGenerator function to ensure unique sequential values.
 */
const diIndex = IndexGenerator();

/**
 * Creates a new immutable token for dependency injection.
 * 
 * @typeParam T - The type that this token represents
 * @param name - A string identifier for the token
 * @returns A frozen token object with a name and unique dependency injection index
 * 
 * @example
 * ```typescript
 * const userServiceToken = newToken<UserService>('UserService');
 * ```
 */
export function newToken<T>(name: string): Token<T> {
  return Object.freeze(Object.assign(Object.create(null), { name, di_index: diIndex.next().value }));
}

function* IndexGenerator() {
  let i = Number.MIN_SAFE_INTEGER;
  while (true) {
    yield i++;
  }
}