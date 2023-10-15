import { CONTEXT } from '@items/common';
import { ElementContext } from './element-context';
import { throwNoContext } from './utils/util';

let INSTANCE: DocumentContext;

export class DocumentContext extends ElementContext {
  static {
    if (document && !Object.hasOwn(document, CONTEXT)) {
      INSTANCE = new this();
      Object.assign(document, { [CONTEXT]: DocumentContext.create() });
    }
  }

  static create(): DocumentContext {
    return INSTANCE ?? throwNoContext(document.nodeName);
  }

  constructor() {
    super();
  }
}
