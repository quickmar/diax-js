import { Context } from '@diax/common';
import { ElementContext, DocumentContext } from '@diax/context';
import { useContext, getCurrentContext } from '@diax/context/src/context';

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
