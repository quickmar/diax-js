import { Supplier, Token } from '@diax-js/common';
import { getCurrentContext } from './context';
import { instantiate } from './utils/util';

export const useToken = <T>(token: Token<T>, supplier: Supplier<T>) => {
  const context = getCurrentContext();
  if (context.dependencies.hasInstance(token)) {
    return context.dependencies.getInstance(token);
  }
  return instantiate(context, token, supplier);
};
