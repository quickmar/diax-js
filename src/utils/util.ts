import { CONTEXT } from '../context/context';
import { NoArgType } from '../model/common';
import { Context } from '../model/context';
import { ContextElement } from '../model/elements';

export function throwNowContext(description: string): never {
  throw new Error(`For ${description} Context is not defined`);
}

export function getElementContext(element: Element): Context {
  if (hasContext(element)) {
    return element[CONTEXT];
  }
  throwNowContext(element.localName);
}

export function hasContext(element: object): element is ContextElement {
  return Object.hasOwn(element, CONTEXT) && element instanceof HTMLElement;
}

export function instantiate<T>(context: Context, type: NoArgType<T>) {
  try {
    context.dependencies.setInstance(type, null);
    const instance = new type();
    context.dependencies.setInstance(type, instance);
    return instance;
  } catch (e) {
    context.dependencies.removeInstance(type);
    throw e;
  }
}
