import { Context } from '@diax-js/common';
import { ElementContext } from '../src/element-context';
import { DocumentContext } from '../src/document-context';

describe.each([ElementContext, DocumentContext])('Context', (ContextCtor) => {
  let context: Context;

  beforeEach(() => {
    context = new ContextCtor(document.createElement('a'));
  });

  it('should create new context', () => {
    expect(context).toBeTruthy();
  });

  it('should has host', () => {
    expect(Reflect.has(context, 'host')).toBe(true);
  });

  it('should has instance', () => {
    expect(Reflect.has(context, 'instance')).toBe(true);
  });

  it('should has dependencies', () => {
    expect(Reflect.has(context, 'dependencies')).toBe(true);
  });
});
