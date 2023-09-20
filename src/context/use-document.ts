import { Context } from '../model/context';
import { hasContext, throwNowContext } from '../utils/util';
import { CONTEXT, useContext } from './context';

export const useDocument = (fn: VoidFunction) => {
  let context: Context | null = initDocumentContext();
  useContext(context ?? throwNowContext(document.nodeName), fn);
};

export function initDocumentContext() {
  let context: Context | null = null;
  if (!hasContext(document)) {
    context = null;
    Reflect.set(document, CONTEXT, context);
  } else {
    context = Reflect.get(document, CONTEXT);
  }
  return context;
}
