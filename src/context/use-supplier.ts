import { NoArgType, Supplier } from '../model/common';
import { getNodeContext } from '../utils/util';

export function useSupplier<T>(element: Element, type: NoArgType<T>, supplier: Supplier<T>): T {
  const context = getNodeContext(element);
  const instance = supplier();
  context.dependencies.setInstance(type, instance);
  return instance;
}
