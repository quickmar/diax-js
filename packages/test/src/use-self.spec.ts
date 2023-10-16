import { Context } from '@items/common';
import { DocumentContext, ElementContext, useSelf } from '@items/context';
import { useContext } from '@items/context/src/context';

class TestService {}

class TestServiceParent {
  child = useSelf(TestService);
}

class TestServiceCyclic {
  child = useSelf(TestServiceCyclic);
}

describe.each([ElementContext, DocumentContext])('useSelf', (ContextCtor) => {
  let context: Context;
  let instance: TestService;

  beforeEach(() => {
    context = new ContextCtor();
  });

  it('should create instance', () => {
    useContext(context, () => {
      instance = useSelf(TestService);
    });

    expect(instance).toEqual(new TestService());
  });

  it('should return same instance', () => {
    useContext(context, () => {
      instance = useSelf(TestService);
      const sameInstance = useSelf(TestService);

      expect(sameInstance).toBe(instance);
    });
  });

  it('should create deep relations', () => {
    useContext(context, () => {
      const parent = useSelf(TestServiceParent);
      instance = useSelf(TestService);

      expect(parent).toBeTruthy();
      expect(parent.child).toBe(instance);
    });
  });

  it('should throw when cyclic dependency detected', () => {
    useContext(context, () => {
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
