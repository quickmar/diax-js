import { getNodeContext } from '../utils/util';
import { useContext } from './context';

export const useDocument = (fn: VoidFunction) => {
  const context = getNodeContext(document);
  useContext(context, fn);
};
