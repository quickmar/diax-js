import { useElement, useSelf } from '../main';
import { Attributes } from '../src/rendering/attributes/attribute-name';
import { RenderState } from '../src/rendering/attributes/render-state';
import { RenderStrategy } from '../src/rendering/attributes/render-strategy';
import { DetectionWalker } from '../src/rendering/strategy/detection-walker';
import { DocumentWalker } from '../src/rendering/strategy/document-walker';
import { SelfWalker } from '../src/rendering/strategy/self-walker';
import { SubTreeWalker } from '../src/rendering/strategy/sub-tree-walker';
import { TestRenderingElement } from './utils';

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
        throw new Error('Expected error');
      });

      walker.walk(element);

      expect(element.getAttribute(Attributes.RENDER_STATE)).toBe(RenderState.FAILED);
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
        `;
      vi.resetAllMocks();

      walker.walk(element);

      const elements = element.querySelectorAll(`[${att}]`);
      elements.forEach((element) => {
        useElement(element, () => {
          expect(useSelf(TestRenderingElement).spy).not.toBeCalled();
        });
      });
    }
  });
});
