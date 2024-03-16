import { CONTEXT, DI_TOKEN } from '@diax-js/common/context';
import { BaseElement } from '../src/base-element';
import { TestBaseElement, TestTarget } from './utils';

describe('BaseElement', () => {
  let element: TestBaseElement;

  beforeAll(() => {
    vi.stubGlobal(
      'requestIdleCallback',
      vi.fn().mockImplementation((fn) => fn()),
    );
  });

  beforeEach(() => {
    element = new TestBaseElement();
  });

  it('should create', () => {
    expect(element).toBeTruthy();
  });

  it('should has observed attributes', () => {
    expect(Reflect.has(TestBaseElement, 'observedAttributes')).toBe(true);
  });

  it('should has target', () => {
    expect(Reflect.has(TestBaseElement, 'target')).toBe(true);
  });

  it('should be instanceof BaseElement', () => {
    expect(element).toBeInstanceOf(BaseElement);
  });

  it('should has @@context slot', () => {
    expect(Object.hasOwn(element, CONTEXT)).toBe(true);
  });

  it('should not create instance', () => {
    expect(element[CONTEXT].instance).not.toBeInstanceOf(TestTarget);
  });

  it('should create instance', () => {
    document.body.appendChild(element);

    expect(element[CONTEXT].instance).toBeInstanceOf(TestTarget);

    element.remove();
  });

  it('should add to dependencies', () => {
    document.body.appendChild(element);
    const instance = element[CONTEXT].dependencies.getInstance(
      Object.getOwnPropertyDescriptor(TestTarget, DI_TOKEN)?.value,
    );

    expect(instance).toBeInstanceOf(TestTarget);
    element.remove();
  });

  it('should destroy context', () => {
    const spy = vi.spyOn(element[CONTEXT], 'destroy');

    document.body.appendChild(element);
    element.remove();

    expect(spy).toBeCalledTimes(1);
  });

  it('should call init', () => {
    document.body.appendChild(element);

    expect(element[CONTEXT].instance.init).toBeCalledTimes(1);
    element.remove();
  });

  it('should call destroy', () => {
    const destroy = vi.spyOn(element[CONTEXT], 'destroy');

    document.body.appendChild(element);
    document.body.removeChild(element);

    expect(destroy).toBeCalledTimes(1);
  });

  it('should stub instance', () => {
    const stubInstance1 = element[CONTEXT].instance;
    document.body.appendChild(element);

    const instance = element[CONTEXT].instance;
    document.body.removeChild(element);

    const stubInstance2 = element[CONTEXT].instance;

    expect(stubInstance1).not.toBe(stubInstance2);
    expect(stubInstance1).toEqual(stubInstance2);
    expect(stubInstance1).not.toEqual(instance);
  });

  it('should call attribute change callback', () => {
    const spy = vi.fn();
    const attributes = element[CONTEXT].attributes;
    attributes['test-target'] = {
      set value(value: string) {
        spy(value);
      },
    };

    element.setAttribute('test-target', 'test');

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('test');
  });
});
