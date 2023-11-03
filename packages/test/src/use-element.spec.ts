import { useElement } from '@diax/context';
import { createContextElement } from './utils';
import { useHost } from '@diax/context/host';

describe('useElement', () => {
  let element: Element;

  beforeEach(() => {
    element = createContextElement('div');
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
