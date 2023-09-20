import { NoArgType } from '../model/common';
import { Context } from '../model/context';
import { getCurrentContext } from './context';

export function useSelf<T>(type: NoArgType<T>): T {
  const context = getCurrentContext();
  if (context.dependencies.hasInstance(type)) {
    return context.dependencies.getInstance(type);
  }
  return instantiate(context, type);
}

export function instantiate<T>(context: Context, type: NoArgType<T>) {
    context.dependencies.setInstance(type, null);
    const instance = new type();
    context.dependencies.setInstance(type, instance);
    return instance;
}

