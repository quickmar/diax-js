import { CONTEXT } from "@elementy/common";
import { DocumentContext } from "@elementy/context";

describe('document context', () => {
  it('should document has context', () => {
    expect(Reflect.get(document, CONTEXT)).toBeInstanceOf(DocumentContext);
  });

  it('should document context be singleton', () => {
    expect(Reflect.get(document, CONTEXT)).toBe(DocumentContext.create());
  });
});
