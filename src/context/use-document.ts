import { hasContext, throwNowContext } from '../utils/util';
import { CONTEXT, Context, useContext } from './context';

export const useDocument = (fn: VoidFunction) => {
  const doc = document;
  let context: Context | null = null;
  if (!hasContext(doc)) {
    context = null;
    Reflect.set(doc, CONTEXT, context);
  } else {
    context = Reflect.get(doc, CONTEXT);
  }
  useContext(context ?? throwNowContext(doc.nodeName), fn);
};
