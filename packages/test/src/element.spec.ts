import { useElement, useSelf } from "@diax/context";
import { TestElement, TestFormElement, TestRenderingElement } from "./utils";

describe.each([
  [{ Ctor: TestElement, name: 'test-element' }],
  [{ Ctor: TestFormElement, name: 'test-form-element' }],
  [{ Ctor: TestRenderingElement, name: 'test-rendering-element' }],
])('@Element', ({ Ctor, name }) => {
  let element: HTMLElement;

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
    element = document.createElement(name);
  });

  it('should create', () => {
    expect(element).toBeTruthy();
  });

  it('should constructor have target', () => {
    const elementCtor = customElements.get(name) ?? {};

    expect(Reflect.get(elementCtor, 'target')).toBe(Ctor);
  });

  it('should constructor have observedAttributes', () => {
    const elementCtor = customElements.get(name) ?? {};

    expect(Reflect.get(elementCtor, 'observedAttributes')).toBe(Ctor.observedAttributes);
  });

  it('should have defined context', () => {
    useElement(element, () => {
      expect(useSelf(Ctor)).toBeInstanceOf(Ctor);
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
      expect(useSelf(Ctor).spy).toBeCalledTimes(times);
      vi.clearAllMocks();
    });
  }
});
