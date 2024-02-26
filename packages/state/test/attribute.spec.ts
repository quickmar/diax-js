import { AttributeSignal } from '@diax-js/common/state';
import { getTestContext, useMockContext } from '@diax-js/test';
import { attribute } from '../src/signals';
import { HTMLElementCallbacks } from '@diax-js/common/custom-element';

describe('Attribute', () => {
  let a: AttributeSignal;
  let host: HTMLElement & HTMLElementCallbacks;

  useMockContext(() => {
    host = getTestContext().host as HTMLElement & HTMLElementCallbacks;
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
    a.value = 'test';

    expect(host.getAttribute('data-unit-test')).toBe('test');
  });

});
