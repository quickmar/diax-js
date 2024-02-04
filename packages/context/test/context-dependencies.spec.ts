import { Dependencies } from '@diax-js/common';
import { BaseDependencies } from '../src/element-context';
import { autoAssignToken } from '../src/utils/util';

describe.each([BaseDependencies])('Dependencies', (DependenciesCtor) => {
  let dependencies: Dependencies;

  beforeEach(() => {
    dependencies = new DependenciesCtor();
  });

  it('should create', () => {
    expect(dependencies).toBeTruthy();
  });

  it('should add dependency', () => {
    dependencies.setInstance(autoAssignToken(Object), {});

    expect(dependencies.getInstance(autoAssignToken(Object))).toEqual({});
  });

  it('should not add dependency if already exist', () => {
    dependencies.setInstance(autoAssignToken(Object), { test: 'TEST' });
    dependencies.setInstance(autoAssignToken(Object), { test: 'TEST1' });

    expect(dependencies.getInstance(autoAssignToken(Object))).toEqual({ test: 'TEST' });
  });

  it('should detect if has dependency', () => {
    dependencies.setInstance(autoAssignToken(Object), { test: 'TEST' });

    expect(dependencies.hasInstance(autoAssignToken(Object))).toBe(true);
  });

  it('should detect if has no dependency', () => {
    expect(dependencies.hasInstance(autoAssignToken(Object))).toBe(false);
  });

  it('should detect if has no dependency', () => {
    expect(dependencies.hasInstance(autoAssignToken(Object))).toBe(false);
  });

  it('should throw when get null', () => {
    dependencies.setInstance(autoAssignToken(Object), null);

    expect(() => dependencies.getInstance(autoAssignToken(Object))).toThrowError(
      'Cyclic dependency detected! Object',
    );
  });

  it('should throw when not defined', () => {
    expect(() => dependencies.getInstance(autoAssignToken(Object))).toThrowError(
      'For type Object dependency is not defined',
    );
  });

  it('should remove dependency', () => {
    dependencies.setInstance(autoAssignToken(Object), {});
    expect(dependencies.getInstance(autoAssignToken(Object))).toEqual({});

    dependencies.removeInstance(autoAssignToken(Object));
    expect(() => dependencies.getInstance(autoAssignToken(Object))).toThrow();
  });
});
