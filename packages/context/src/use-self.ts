import { NoArgType } from '@elementy/common';
import { getCurrentContext } from './context';
import { instantiate } from './utils/util';

export function useSelf<T>(type: NoArgType<T>): T {
  const context = getCurrentContext();
  if (context.dependencies.hasInstance(type)) {
    return context.dependencies.getInstance(type);
  }
  return instantiate(context, type);
}

