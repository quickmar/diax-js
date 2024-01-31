import { ContextElement, Type } from '@diax-js/common';
import { useElement, useSelf, useDocument, useParent } from '@diax-js/context';
import { createContextElementFromString } from '@diax-js/test';

class DocumentService {}
class ElementService {}
class Service {}

describe('useParent', () => {
  let element: ContextElement;
  let documentInstance: DocumentService;
  let elementInstance: ElementService;

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

    useDocument(() => {
      documentInstance = useSelf(DocumentService);
    });

    useElement(element, () => {
      elementInstance = useSelf(ElementService);
    });
  });

  it('should search dependency', () => {
    testHasDependency(ElementService, elementInstance);
  });

  it('should search dependency up to document', () => {
    testHasDependency(DocumentService, documentInstance);
  });

  it('should create instance when could not find in parent context', () => {
    testSkipSelf(false);
  });

  it('should not create instance', () => {
    testSkipSelf(false);
  });

  function testSkipSelf(skipSelf: boolean): void {
    const id2 = element.querySelector('#c') as Element;
    expect(id2).toBeTruthy();

    useElement(id2, () => {
      expect(!!useParent(Service, skipSelf)).toBe(!skipSelf);
    });
  }

  function testHasDependency(type: Type<object>, instantiate: object, skipSelf?: boolean): void {
    const id2 = element.querySelector('#c') as Element;
    expect(id2).toBeTruthy();

    useElement(id2, () => {
      expect(useParent(type, skipSelf)).toBe(instantiate);
    });
  }
});
