import { getCurrentContext } from '../src/context/context';
import { useElement } from '../src/context/use-element';
import { ContextNode } from '../src/model/elements';
import { createContextElement } from './utils';

describe('useElement', () => {
  let element: ContextNode;

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
