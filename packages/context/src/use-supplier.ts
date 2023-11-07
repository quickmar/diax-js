import { Supplier, Type } from '@diax-js/common';
import { useToken } from './use-token';
import { autoAssignToken } from './utils/util';

export function useSupplier<T>(type: Type<T>, supplier: Supplier<T>): T {
  return useToken(autoAssignToken(type), supplier);
}
