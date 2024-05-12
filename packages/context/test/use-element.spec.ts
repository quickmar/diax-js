import { useElement } from '../src/use-element';
import { useHost } from '../src/host/use-host';
import { MockContextElement } from '@diax-js/test';

describe('useElement', () => {
  let element: Element;

  beforeEach(() => {
    element = new MockContextElement();
  });

  it('should use element context', () => {
    useElement(element, () => {
      expect(useHost()).toBeTruthy();
    });
  });

  it('should not use element context', () => {
    useElement(element, () => {});
    expect(() => useHost()).toThrow();
  });

  it('should throw if element does not have context', () => {
    const action = () => useElement(document.createElement('div'), () => {});

    expect(action).toThrowError('For DIV. Context is not defined!');
  });
});
