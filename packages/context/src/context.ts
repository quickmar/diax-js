import { Context } from '@diax-js/common/context';
import { throwNoContext } from './utils/util';

let currentContext: Context | null = null;

export const useContext = (context: Context, fn: VoidFunction) => {
  const previousContext = currentContext;
  try {
    currentContext = context;
    fn();
  } finally {
    currentContext = previousContext;
  }
};

export const getCurrentContext = () => {
  return currentContext ?? throwNoContext('Context can be use only inside of useContext Function');
};

export const _getCurrentContext = () => {
  return currentContext;
};
