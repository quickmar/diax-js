import { CONTEXT } from "@diax-js/common";
import { DocumentContext } from "@diax-js/context";

describe('document context', () => {
  it('should document has context', () => {
    expect(Reflect.get(document, CONTEXT)).toBeInstanceOf(DocumentContext);
  });

  it('should document context be singleton', () => {
    expect(Reflect.get(document, CONTEXT)).toBe(DocumentContext.create());
  });
});
