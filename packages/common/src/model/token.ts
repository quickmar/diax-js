import { Type } from './common';

export const DI_TOKEN = Symbol.for('@@token');

interface _Token<T> {
  type: Type<T>;
  name: string;
  readonly di_index: number;
}

export interface Token<T> extends Omit<_Token<T>, 'type'> {}

const diIndex = IndexGenerator();
const contextIndex = IndexGenerator();
const stateIndex = IndexGenerator();

export function newToken<T>(name: string): Token<T> {
  return Object.freeze(Object.assign(Object.create(null), { name, di_index: diIndex.next().value }));
}

export function newContextID(): number {
  return contextIndex.next().value as number;
}

export function newStateID(): number {
  return stateIndex.next().value as number;
}

function* IndexGenerator() {
  let i = Number.MIN_SAFE_INTEGER;
  while (true) {
    yield i++;
  }
}
