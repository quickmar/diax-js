import { CONTEXT, Context, NoArgType } from '@diax-js/common';
import { getCurrentContext } from './context';
import { autoAssignToken, hasContext, instantiate } from './utils/util';
import { DocumentContext } from './document-context';

export function useParent<T>(type: NoArgType<T>, skipSelf?: boolean): T | undefined {
  const currentContext = getCurrentContext();
  const token = autoAssignToken(type);
  for (const context of contextIterator(currentContext, skipSelf)) {
    if (context.dependencies.hasInstance(token)) {
      return context.dependencies.getInstance(token);
    }
  }
  return skipSelf ? undefined : instantiate(currentContext, token, () => new type());
}

function* contextIterator(context: Context, skipSelf = false) {
  let element = skipSelf ? context.host.parentElement : context.host;
  do {
    if (element && hasContext(element)) {
      yield element[CONTEXT];
    }
    element = element?.parentElement ?? null;
  } while (element);
  yield DocumentContext.create();
  return null;
}
