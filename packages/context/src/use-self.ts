import { NoArgType } from '@diax-js/common';
import { useSupplier } from './use-supplier';

export function useSelf<T>(type: NoArgType<T>): T {
  return useSupplier(type, () => new type());
}
