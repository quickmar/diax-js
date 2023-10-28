import { useContext } from './context';
import { getNodeContext } from './utils/util';

export const useElement = (element: Element, fn: VoidFunction) => {
  const context = getNodeContext(element);
  useContext(context, fn);
};

