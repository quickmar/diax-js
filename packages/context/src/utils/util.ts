import { CONTEXT, Context, ContextNode, DI_TOKEN, NoArgType, Supplier, Token, newToken } from '@diax/common';

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

export function instantiate<T>(context: Context, token: Token<T>, supplier: Supplier<T>) {
  try {
    context.dependencies.setInstance(token, null);
    const instance = supplier();
    context.dependencies.removeInstance(token);
    context.dependencies.setInstance(token, instance);
    return instance;
  } catch (e) {
    context.dependencies.removeInstance(token);
    throw e;
  }
}

export function autoAssignToken<T>(type: NoArgType<T>): Token<T> {
  if (Object.hasOwn(type, DI_TOKEN)) return Object.getOwnPropertyDescriptor(type, DI_TOKEN)?.value;
  const token = newToken(type.name);
  Object.defineProperty(type, DI_TOKEN, {
    value: token,
    configurable: false,
    enumerable: false,
    writable: false,
  });
  return token;
}
