import { ContextElement } from '@items/common';
import { createContextElementFromString } from './utils';
import { useElement, useSelf, useDocument, useParent } from '@items/context';

class DocumentService {}

describe.skip('useParent', () => {
  let element: ContextElement;
  let object: object;
  let documentService: DocumentService;

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
      object = useSelf(Object);
    });

    useDocument(() => {
      documentService = useSelf(DocumentService);
    });
  });

  it('should search dependency', () => {
    const id2 = element.querySelector('#c') as Element;
    expect(id2).toBeTruthy();

    useElement(id2, () => {
      expect(useParent(Object)).toBe(object);
    });
  });

  it('should search dependency up to document', () => {
    const id2 = element.querySelector('#c') as Element;
    expect(id2).toBeTruthy();

    useElement(id2, () => {
      expect(useParent(DocumentService)).toBe(documentService);
    });
  });
});
