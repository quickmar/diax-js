import { CONTEXT } from "@diax-js/common/context";
import { DocumentContext } from "../src/document-context";

describe('document context', () => {
  it('should document has context', () => {
    expect(Reflect.get(document, CONTEXT)).toBeInstanceOf(DocumentContext);
  });

  it('should document context be singleton', () => {
    expect(Reflect.get(document, CONTEXT)).toBe(DocumentContext.create());
  });
});
