import { useElement, useSelf } from '../main';
import { RenderingHTMLElement } from '../src/model/elements';
import { Attributes } from '../src/rendering/attributes/attribute-name';
import { RenderState } from '../src/rendering/attributes/render-state';
import { TestRenderingElement, flush } from './utils';

declare global {
  interface HTMLElementTagNameMap {
    'test-rendering-element': RenderingHTMLElement;
  }
}

describe('@RenderingElement', () => {
  let element: RenderingHTMLElement;
  let instance: TestRenderingElement;

  beforeEach(() => {
    element = document.createElement('test-rendering-element');
    useElement(element, () => {
      instance = useSelf(TestRenderingElement);
    });
  });

  it('should create', () => {
    expect(element).toBeTruthy();
  });

  it('should be render associated', () => {
    expect(Reflect.get(element.constructor, 'renderAssociated')).toBe(true);
  });

  it('should render', () => {
    element.render();

    expect(instance.spy).toHaveBeenCalledOnce();
  });

  it('should render after rendering attribute is set', async () => {
    document.body.appendChild(element);
    instance.spy.mockReset();

    element.setAttribute(Attributes.RENDER_STATE, RenderState.PENDING);
    await flush();

    expect(instance.spy).toHaveBeenCalledOnce();
    document.body.removeChild(element);
  });
});
