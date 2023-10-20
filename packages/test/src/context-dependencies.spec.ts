import { Dependencies } from '@elementy/common';
import { BaseDependencies } from '@elementy/context';

describe.each([BaseDependencies])('Dependencies', (DependenciesCtor) => {
  let dependencies: Dependencies;

  beforeEach(() => {
    dependencies = new DependenciesCtor();
  });

  it('should create', () => {
    expect(dependencies).toBeTruthy();
  });

  it('should add dependency', () => {
    dependencies.setInstance(Object, {});

    expect(dependencies.getInstance(Object)).toEqual({});
  });

  it('should not add dependency', () => {
    const action = () => dependencies.setInstance(Object, 'Hello');

    expect(action).toThrowError('Hello is not instanceof function Object() { [native code] }');
  });

  it('should not add dependency if already exist', () => {
    dependencies.setInstance(Object, { test: 'TEST' });
    dependencies.setInstance(Object, { test: 'TEST1' });

    expect(dependencies.getInstance(Object)).toEqual({ test: 'TEST' });
  });

  it('should detect if has dependency', () => {
    dependencies.setInstance(Object, { test: 'TEST' });

    expect(dependencies.hasInstance(Object)).toBe(true);
  });

  it('should detect if has no dependency', () => {
    expect(dependencies.hasInstance(Object)).toBe(false);
  });

  it('should detect if has no dependency', () => {
    expect(dependencies.hasInstance(Object)).toBe(false);
  });

  it('should throw when get null', () => {
    dependencies.setInstance(Object, null);

    expect(() => dependencies.getInstance(Object)).toThrowError(
      'Cyclic dependency detected! function Object() { [native code] }',
    );
  });

  it('should throw when not defined', () => {
    expect(() => dependencies.getInstance(Object)).toThrowError(
      'For type function Object() { [native code] } dependency is not defined',
    );
  });

  it('should remove dependency', () => {
    dependencies.setInstance(Object, {});
    expect(dependencies.getInstance(Object)).toEqual({});

    dependencies.removeInstance(Object);
    expect(() => dependencies.getInstance(Object)).toThrow();
  });
});
