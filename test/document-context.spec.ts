import { CONTEXT } from '../src/context/context';
import { DocumentContext } from '../src/context/document-context';

describe('document context', () => {
  it('should document has context', () => {
    expect(Reflect.get(document, CONTEXT)).toBeInstanceOf(DocumentContext);
  });

  it('should document context be singleton', () => {
    expect(Reflect.get(document, CONTEXT)).toBe(DocumentContext.create());
  });
});
