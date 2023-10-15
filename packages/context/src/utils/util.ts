import { CONTEXT, Context, ContextNode, NoArgType } from "@items/common";

export function throwNoContext(description: string): never {
  throw new Error(`${description}. Context is not defined!`);
}

export function getNodeContext(element: Node): Context {
  if (hasContext(element)) {
    return element[CONTEXT];
  }
  throwNoContext(`For ${element.nodeName}`);
}

export function hasContext(element: object): element is ContextNode {
  return Object.hasOwn(element, CONTEXT) && element instanceof Node;
}

export function instantiate<T>(context: Context, type: NoArgType<T>) {
  try {
    context.dependencies.setInstance(type, null);
    const instance = new type();
    context.dependencies.removeInstance(type);
    context.dependencies.setInstance(type, instance);
    return instance;
  } catch (e) {
    context.dependencies.removeInstance(type);
    throw e;
  }
}
