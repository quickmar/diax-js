import { AttributeSignal } from '@diax-js/common/state';
import { useMockContext } from '@diax-js/test';
import { attribute } from '../src/signals';

describe('Attribute', () => {
  let a: AttributeSignal;

  useMockContext(() => {
    a = attribute('data-unit-test');
  });

  it('should create', () => {
    expect(a).toBeTruthy();
  });

  it('should has same value as host attribute', () => {
    expect(a).toBeTruthy();
  });
});
