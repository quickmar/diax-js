import { NoArgType } from '../model/common';
import { instantiate } from '../utils/util';
import { getCurrentContext } from './context';

export function useSelf<T>(type: NoArgType<T>): T {
  const context = getCurrentContext();
  if (context.dependencies.hasInstance(type)) {
    return context.dependencies.getInstance(type);
  }
  return instantiate(context, type);
}

