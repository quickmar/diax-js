import { Context } from '../model/context';
import { throwNowContext } from '../utils/util';

let currentContext: Context | null = null;

export const CONTEXT = Symbol('context');


export const useContext = (context: Context, fn: VoidFunction) => {
  try {
    currentContext = context;
    fn();
  } finally {
    currentContext = null;
  }
};

export const getCurrentContext = () => {
  return currentContext ?? throwNowContext('TODO');
};
