import { Supplier, Type } from '@elementy/common';
import { getCurrentContext } from './context';

export function useSupplier<T>(type: Type<T>, supplier: Supplier<T>): T {
  const context = getCurrentContext();
  if (context.dependencies.hasInstance(type)) {
    return context.dependencies.getInstance(type);
  } else {
    const instance = supplier();
    context.dependencies.setInstance(type, instance);
    return instance;
  }
}
