import { Type } from './common';

export const DI_TOKEN = Symbol.for('@@token');

interface _Token<T> {
  type: Type<T>;
  name: string;
  readonly di_index: number;
}

export interface Token<T> extends Omit<_Token<T>, 'type'> {}

const index = diIndexGenerator();

export function newToken<T>(name: string): Token<T> {
  return Object.freeze(Object.assign(Object.create(null), { name, di_index: index.next().value }));
}

function* diIndexGenerator() {
  let i = 0;
  while (true) {
    yield i++;
  }
}
