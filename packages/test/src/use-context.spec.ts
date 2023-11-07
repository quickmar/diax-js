import { Context } from '@diax-js/common';
import { ElementContext, DocumentContext } from '@diax-js/context';
import { useContext, getCurrentContext } from '@diax-js/context';

describe.each([ElementContext, DocumentContext])('useContext', (ContextCtor) => {
  let context: Context;
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('a');
    context = new ContextCtor(element);
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
    const newElement = document.createElement('a');
    const newContext = new ElementContext(newElement);
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
