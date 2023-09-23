import { Supplier } from '../model/common';
import { getNodeContext } from '../utils/util';
import { useContext } from './context';

export function useSupplier<T>(element: Element, supplier: Supplier<T>): T {
  let instance: T | null = null;
  const context = getNodeContext(element);
  useContext(context, () => {
    instance = supplier();
  });
  if (instance) {
    return instance;
  }
  throw new ReferenceError('TODO');
}
