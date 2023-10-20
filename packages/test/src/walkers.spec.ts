import {
  Attributes,
  DetectionWalker,
  DocumentWalker,
  RenderState,
  RenderStrategy,
  SelfWalker,
  SubTreeWalker,
} from '@elementy/rendering-element';
import { TestRenderingElement } from './utils';
import { useElement, useSelf } from '@elementy/context';

describe('walkers', () => {
  let walker: DetectionWalker;
  let element: HTMLElement;
  let instance: TestRenderingElement;

  afterEach(() => {
    document.body.removeChild(element);
  });

  beforeEach(() => {
    element = document.createElement('test-rendering-element');
    document.body.appendChild(element);
    useElement(element, () => {
      instance = useSelf(TestRenderingElement);
    });
  });

  describe.each([DocumentWalker, SubTreeWalker, SelfWalker])('common walker behavior', (WalkerCtor) => {
    beforeEach(() => {
      walker = new WalkerCtor();
    });

    it('should create', () => {
      expect(walker).toBeTruthy();
    });

    it('should walk when render associate', () => {
      walker.walk(element);

      expect(element.getAttribute(Attributes.RENDER_STATE)).toBe(RenderState.RENDERED);
    });

    it('should not walk when not render associate', () => {
      const element = document.createElement('div');

      walker.walk(element);

      expect(element.getAttribute(Attributes.RENDER_STATE)).toBe(null);
    });

    it('should not walk when state is disabled', () => {
      element.setAttribute(Attributes.RENDER_STATE, RenderState.DISABLED);

      walker.walk(element);

      expect(element.getAttribute(Attributes.RENDER_STATE)).toBe(RenderState.DISABLED);
    });

    it('should set failed attribute when error', () => {
      instance.spy.mockImplementationOnce(() => {
        throw new Error();
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementationOnce((err) => expect(err).toEqual(new Error()));

      walker.walk(element);

      expect(element.getAttribute(Attributes.RENDER_STATE)).toBe(RenderState.FAILED);
      expect(consoleSpy).toBeCalledTimes(1);
    });
  });

  describe.each([DocumentWalker, SubTreeWalker])('SubTree Walkers', (WalkerCtor) => {
    beforeEach(() => {
      walker = new WalkerCtor();
    });

    it('should walk every rendering element', () => {
      element.innerHTML = `
        <div></div>
        <test-rendering-element></test-rendering-element>
        <test-rendering-element></test-rendering-element>
        <test-rendering-element></test-rendering-element>
        <test-rendering-element></test-rendering-element>
        `;

      walker.walk(element);

      expect(document.querySelectorAll(`[${Attributes.RENDER_STATE}]`).length).toBe(5);
    });

    it('should skip disabled elements', () => {
      testSkip(Attributes.RENDER_STATE, RenderState.DISABLED);
    });

    it('should skip self strategy elements', () => {
      testSkip(Attributes.RENDER_STRATEGY, RenderStrategy.SELF);
    });

    function testSkip(att: Attributes, value: string): void {
      element.innerHTML = `
        <test-rendering-element ${att}="${value}"></test-rendering-element>
        <test-rendering-element ${att}="${value}"></test-rendering-element>
        `;
      vi.resetAllMocks();

      walker.walk(element);

      const elements = element.querySelectorAll(`[${att}]`);
      elements.forEach((el) => {
        useElement(el, () => {
          expect(useSelf(TestRenderingElement).spy).not.toBeCalled();
        });
      });
    }
  });
});
