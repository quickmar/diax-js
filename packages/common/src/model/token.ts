import { Type } from './common';

export const DI_TOKEN = Symbol.for('@@token');

interface _Token<T> {
  type: Type<T>;
  name: string;
  readonly di_index: number;
}

export interface Token<T> extends Omit<_Token<T>, 'type'> {}

const diIndex = IndexGenerator();

export function newToken<T>(name: string): Token<T> {
  return Object.freeze(Object.assign(Object.create(null), { name, di_index: diIndex.next().value }));
}

function* IndexGenerator() {
  let i = Number.MIN_SAFE_INTEGER;
  while (true) {
    yield i++;
  }
}
