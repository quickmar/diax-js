import { CONTEXT, Context, Dependencies, TargetCallbacks, newContextID } from '@diax-js/common';
import { BaseDependencies } from './element-context';
import { throwNoContext } from './utils/util';

let INSTANCE: DocumentContext;

export class DocumentContext implements Context {
  static {
    if (document && !Object.hasOwn(document, CONTEXT)) {
      INSTANCE = new this();
      Object.assign(document, { [CONTEXT]: DocumentContext.create() });
    }
  }

  static create(): DocumentContext {
    return INSTANCE ?? throwNoContext(document.nodeName);
  }

  get host(): never {
    throw Error('Document Context has no host.');
  }
  readonly instance: TargetCallbacks = {};
  readonly dependencies: Dependencies = new BaseDependencies();
  readonly contextId = newContextID();
  readonly disposables = new Set<VoidFunction>();
  subscriptionMode = null;
  subscription = null;
}
