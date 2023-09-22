import { useElement } from '../src/context/use-element';
import { useParent } from '../src/context/use-parent';
import { useSelf } from '../src/context/use-self';
import { ContextElement } from '../src/model/elements';
import { createContextElementFromString } from './utils';

describe('useParent', () => {
  let element: ContextElement;
  let instance: object;

  beforeEach(() => {
    element = createContextElementFromString(
      `
        <div context id="a">
            <div id="b">
                <div context id="c"></div>
            </div>
        </div>
        <div id="d"></div>
        `,
      'div',
    );

    useElement(element, () => {
      instance = useSelf(Object);
    });
  });

  it.only('should search dependency', () => {
    const id2 = element.querySelector('#c') as Element;
    expect(id2).toBeTruthy();

    useElement(id2, () => {
      expect(useParent(Object)).toBe(instance);
    });
  });
});
