import { useElement } from '@items/context';
import { createContextElement } from './utils';
import { getCurrentContext } from '@items/context/src/context';

describe('useElement', () => {
  let element: Element;

  beforeEach(() => {
    element = createContextElement('div');
  });

  it('should use element context', () => {
    useElement(element, () => {
      expect(getCurrentContext()).toBeTruthy();
    });
  });

  it('should not use element context', () => {
    useElement(element, () => {});
    expect(() => getCurrentContext()).toThrow();
  });

  it('should throw if element does not have context', () => {
    const action = () => useElement(document.createElement('div'), () => {});

    expect(action).toThrowError('For DIV. Context is not defined!');
  });
});
