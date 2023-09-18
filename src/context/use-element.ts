import { hasContext } from '../model/elements';
import { throwNowContext } from '../utils/util';
import { CONTEXT, useContext } from './context';

export const useElement = (element: HTMLElement, fn: VoidFunction) => {
  if (!hasContext(element)) throwNowContext(Object.toString.call(element));
  useContext(element[CONTEXT], fn);
};

