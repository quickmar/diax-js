import { Context } from '../model/context';
import { hasContext, throwNowContext } from '../utils/util';
import { CONTEXT, useContext } from './context';
import { DocumentContext } from './document-context';

let context: Context | null = initDocumentContext();

export const useDocument = (fn: VoidFunction) => {
  context = initDocumentContext();
  useContext(context ?? throwNowContext(document.nodeName), fn);
};

export function initDocumentContext() {
  if (!hasContext(document)) {
    context = new DocumentContext();
    Reflect.set(document, CONTEXT, context);
  } else {
    context = Reflect.get(document, CONTEXT);
  }
  return context;
}
