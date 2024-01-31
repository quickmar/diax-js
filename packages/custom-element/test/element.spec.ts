import { useElement, useSelf } from '@diax-js/context';
import { TestElement } from './utils';
import { BaseElement } from '../src/base-element';
import { TargetCallbacks } from '@diax-js/common';

describe('Custom Element', () => {
  let element: BaseElement<TargetCallbacks>;
  let name: string;
  let instanceConstructor: typeof TestElement;
  let target: TestElement;

  beforeAll(() => {
    expect(globalThis.ElementInternals).toBeFalsy();
    expect(globalThis.HTMLElement?.prototype?.attachInternals).toBeFalsy();

    Object.assign(globalThis, { ElementInternals: class {} });
    Object.assign(HTMLElement.prototype, {
      attachInternals: function () {
        return new ElementInternals();
      },
    });
  });

  afterAll(() => {
    Object.assign(globalThis, { ElementInternals: undefined });
    Object.assign(HTMLElement.prototype, { attachInternals: undefined });
  });

  beforeEach(() => {
    name = 'test-element';
    element = document.createElement(name) as BaseElement<TestElement>;
    target = element.instance as TestElement;
    target.spy = vi.fn();
    instanceConstructor = TestElement;
  });

  it('should create', () => {
    expect(element).toBeTruthy();
  });

  it('should constructor have target', () => {
    const elementCtor = customElements.get(name) ?? {};

    expect(Reflect.get(elementCtor, 'target')).toBe(instanceConstructor);
  });

  it('should constructor have observedAttributes', () => {
    const elementCtor = customElements.get(name) ?? {};

    expect(Reflect.get(elementCtor, 'observedAttributes')).toBe(instanceConstructor.observedAttributes);
  });

  it('should have defined context', () => {
    useElement(element, () => {
      expect(useSelf(instanceConstructor)).toBeInstanceOf(instanceConstructor);
    });
  });

  it('should have defined HTMLElement in context', () => {
    useElement(element, () => {
      expect(useSelf(HTMLElement)).toBe(element);
    });
  });

  it('should call callbacks', () => {
    // connectedCallback
    document.body.appendChild(element);
    assertSypCallTimes(1);

    // attributeChangeCallback
    element.setAttribute('test', 'test');
    assertSypCallTimes(1);

    // disconnectedCallback
    document.body.removeChild(element);
    assertSypCallTimes(1);
  });

  it('should call adopted callback', () => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', './index.html');
    document.body.appendChild(iframe);
    vi.clearAllMocks();

    // adoptedCallback
    iframe.contentWindow?.document.adoptNode(element);
    assertSypCallTimes(1);
  });

  function assertSypCallTimes(times: number): void {
    useElement(element, () => {
      expect(useSelf(instanceConstructor).spy).toBeCalledTimes(times);
      vi.clearAllMocks();
    });
  }
});
