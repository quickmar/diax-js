import { Context } from "@elementy/common";
import { DocumentContext, ElementContext } from "@elementy/context";

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
