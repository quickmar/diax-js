import { ElementContext } from '../src/element-context';
import { DocumentContext } from '../src/document-context';
import { Context } from '@diax-js/common/context';

describe.each([(el: HTMLElement) => new ElementContext(el, {}), () => new DocumentContext()])(
  'Context',
  (ctxSupply) => {
    let context: Context;

    beforeEach(() => {
      context = ctxSupply(document.createElement('div'));
    });

    it('should create new context', () => {
      expect(context).toBeTruthy();
    });

    it('should has host', () => {
      expect(Reflect.has(context, 'host')).toBe(true);
    });

    it('should has dependencies', () => {
      expect(Reflect.has(context, 'dependencies')).toBe(true);
    });
  },
);
