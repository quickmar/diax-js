import { Context } from '@diax-js/common/context';
import { ElementContext } from '../src/element-context';
import { DocumentContext } from '../src/document-context';
import { getCurrentContext, useContext } from '../src/context';

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
