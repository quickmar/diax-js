import { throwNoContext } from '../utils/util';
import { CONTEXT } from './context';
import { ElementContext } from './element-context';

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
