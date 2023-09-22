import { getElementContext } from '../utils/util';
import { useContext } from './context';

export const useElement = (element: Element, fn: VoidFunction) => {
  const context = getElementContext(element);
  useContext(context, fn);
};

