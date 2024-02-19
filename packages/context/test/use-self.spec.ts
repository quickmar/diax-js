import { CONTEXT, Context, ContextHTMLElement } from '@diax-js/common/context';
import { TargetCallbacks } from '@diax-js/common/custom-element';
import { ElementContext, useElement, useSelf } from '@diax-js/context';

class TestService {}

class TestServiceParent {
  child = useSelf(TestService);
}

class TestServiceCyclic {
  child = useSelf(TestServiceCyclic);
}

export class TestElement extends HTMLElement implements ContextHTMLElement {
  [CONTEXT]: Context<TargetCallbacks> = new ElementContext(this);
}

customElements.define('test-self-element', TestElement);

describe('useSelf', () => {
  let element: Element;
  let instance: TestService;

  beforeEach(() => {
    element = new TestElement();
  });

  it('should create instance', () => {
    useElement(element, () => {
      instance = useSelf(TestService);
    });

    expect(instance).toEqual(new TestService());
  });

  it('should return same instance', () => {
    useElement(element, () => {
      instance = useSelf(TestService);
      const sameInstance = useSelf(TestService);

      expect(sameInstance).toBe(instance);
    });
  });

  it('should create deep relations', () => {
    useElement(element, () => {
      const parent = useSelf(TestServiceParent);
      instance = useSelf(TestService);

      expect(parent).toBeTruthy();
      expect(parent.child).toBe(instance);
    });
  });

  it('should throw when cyclic dependency detected', () => {
    useElement(element, () => {
      const action = () => useSelf(TestServiceCyclic);

      expect(action).toThrowError();
    });
  });

  it('should not create instance', () => {
    expect(() => useSelf(String)).toThrowError(
      'Context can be use only inside of useContext Function. Context is not defined!',
    );
  });
});
