import { AttributeSignal } from '@diax-js/common/state';
import { getTestContext, useMockContext } from '@diax-js/test';
import { attribute } from '../src/signals';
import { useElement } from '@diax-js/context';

describe('Attribute', () => {
  let a: AttributeSignal;
  let host: HTMLElement;

  useMockContext(() => {
    host = getTestContext().host as HTMLElement;
    a = attribute('data-unit-test');
  });

  it('should create', () => {
    expect(a).toBeTruthy();
  });

  it('should be empty when host has no attribute', () => {
    expect(a.value).toBe('');
  });

  it('should update signal value', () => {
    host.setAttribute('data-unit-test', 'test');

    expect(a.value).toBe('test');
  });

  it('should update host attribute', () => {
    a.setValue('test');

    expect(host.getAttribute('data-unit-test')).toBe('test');
  });

  it('should throw when attribute name is not defined in observed attributes', () => {
    const action = () =>
      useElement(host, () => {
        attribute('unknown_attribute');
      });

    expect(action).toThrow(
      new ReferenceError(
        `${host.localName} has no attribute 'unknown_attribute' in 'observedAttributes' static property.`,
      ),
    );
  });
});
