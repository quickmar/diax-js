import { RenderingHTMLElement } from '@diax-js/common';
import { useElement, useSelf } from '@diax-js/context';
import { flush } from '@diax-js/test';
import { RenderState } from '../src/rendering/attributes/render-state';
import { Attributes } from '../src/rendering/attributes/attribute-name';
import { TestRenderingElement } from './utils';

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

    expect(instance.spy).toHaveBeenCalledTimes(1);
  });

  it('should render after rendering attribute is set', async () => {
    document.body.appendChild(element);
    instance.spy.mockReset();

    element.setAttribute(Attributes.RENDER_STATE, RenderState.PENDING);
    await flush();

    expect(instance.spy).toHaveBeenCalledTimes(1);
    document.body.removeChild(element);
  });
});
