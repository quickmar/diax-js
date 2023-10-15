import { getCurrentContext, useContext } from '../src/context/context';
import { DocumentContext } from '../src/context/document-context';
import { ElementContext } from '../src/context/element-context';
import { Context } from '../src/model/context';

describe.each([ElementContext, DocumentContext])('useContext', (ContextCtor) => {
  let context: Context;

  beforeEach(() => {
    context = new ContextCtor();
  });

  it('should use context', () => {
    useContext(context, () => {
      expect(getCurrentContext()).toBe(context);
    });
  });

  it('should not use context', () => {
    useContext(context, () => {});

    expect(() => getCurrentContext()).toThrowError(
      'Context can be use only inside of useContext Function. Context is not defined!',
    );
  });

  it('should allow for nesting', () => {
    const newContext = new ElementContext();
    useContext(context, () => {
      expect(getCurrentContext()).toBe(context);
      useContext(newContext, () => {
        expect(getCurrentContext()).toBe(newContext);
      });
      expect(getCurrentContext()).toBe(context);
    });

    expect(() => getCurrentContext()).toThrow();
  });
});
