import { CONTEXT, Context, Dependencies, TargetCallbacks } from '@diax-js/common';
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
  instance: TargetCallbacks = {};
  dependencies: Dependencies = new BaseDependencies();
}
