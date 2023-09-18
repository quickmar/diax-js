import { throwNowContext } from '../utils/util';

export interface Context {}

export const CONTEXT = Symbol('context');

let currentContext: Context | null = null;

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
