import { ElementContext } from '../src/context/element-context';
import { DocumentContext } from '../src/context/document-context';
import { Context } from '../src/model/context';

describe.each([ElementContext, DocumentContext])('Context', (ContextCtor) => {
  let context: Context;

  beforeEach(() => {
    context = new ContextCtor();
  });

  it('should create new context', () => {
    expect(context).toBeTruthy();
  });

  it('should has dependencies', () => {
    expect(context.dependencies).toBeTruthy();
  });
});
