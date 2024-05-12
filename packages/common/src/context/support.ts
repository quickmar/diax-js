import { Token } from "./model";


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