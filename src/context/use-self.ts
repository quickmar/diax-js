import { Type } from '../model/common';
import { Context } from '../model/context';
import { getCurrentContext } from './context';

export function useSelf<T>(type: Type<T>): T {
  const context = getCurrentContext();
  if (context.dependencies.hasInstance(type)) {
    return context.dependencies.getInstance(type);
  }
  return instantiate(context, type);
}

export function instantiate<T>(context: Context, type: Type<T>) {
    context.dependencies.setInstance(type, null);
    const instance = new type();
    context.dependencies.setInstance(type, instance);
    return instance;
}

