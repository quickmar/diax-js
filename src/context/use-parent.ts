import { NoArgType } from '../model/common';
import { Context } from '../model/context';
import { hasContext, instantiate } from '../utils/util';
import { CONTEXT, getCurrentContext } from './context';
import { initDocumentContext } from './use-document';

export function useParent<T>(type: NoArgType<T>, skipSelf?: boolean): T {
  const currentContext = getCurrentContext();
  for (const context of contextIterator(currentContext, skipSelf)) {
    if (context.dependencies.hasInstance(type)) {
      return context.dependencies.getInstance(type);
    }
  }
  return instantiate(currentContext, type);
}

function* contextIterator(context: Context, skipSelf = false) {
  const hostElement = context.dependencies.getInstance(HTMLElement);
  let element = skipSelf ? hostElement.parentElement : hostElement;
  do {
    if (element && hasContext(element)) {
      yield element[CONTEXT];
    }
    element = element?.parentElement ?? null;
  } while (element !== document.body);
  yield initDocumentContext();
  return null;
}
