import { ContextElement } from '../model/elements';
import { CONTEXT, hasContext, useContext } from './context';

export const useElement = (element: ContextElement, fn: VoidFunction) => {
  if (!hasContext(element)) throw new Error(`${element.localName} does not contain context object`);
  useContext(element[CONTEXT], fn);
};

