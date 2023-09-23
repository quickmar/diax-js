import { getNodeContext } from '../utils/util';
import { useContext } from './context';

export const useElement = (element: Element, fn: VoidFunction) => {
  const context = getNodeContext(element);
  useContext(context, fn);
};

