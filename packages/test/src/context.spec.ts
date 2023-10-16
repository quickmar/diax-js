import { Context } from "@items/common";
import { DocumentContext, ElementContext } from "@items/context";

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
