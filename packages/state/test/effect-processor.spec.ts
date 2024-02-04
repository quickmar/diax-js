import { asAny, flush } from '@diax-js/test';
import { Mock } from 'vitest';
import { EffectAction } from '../src/actions';
import { EffectProcessor } from '../src/processors';

describe('EffectProcessor', () => {
  let callable: Mock<[]>;
  let effectAction: EffectAction;
  let effectProcessor: EffectProcessor;

  beforeAll(() => {
    vi.stubGlobal('requestIdleCallback', (fn: VoidFunction) => fn());
    vi.stubGlobal('reportError', vi.fn());
  });

  beforeEach(() => {
    vi.resetAllMocks();
    callable = vi.fn();
    effectAction = new EffectAction(callable);
    effectProcessor = new EffectProcessor();
  });

  it('should create', () => {
    expect(effectProcessor).toBeTruthy();
  });

  it('should put on the processor', () => {
    const spy = vi.spyOn(asAny(effectProcessor), 'put');

    effectProcessor.process(effectAction);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(effectAction);
  });

  it('should execute on microTaskQueue', async () => {
    effectProcessor.process(effectAction);

    expect(callable).not.toBeCalled();

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
  });

  it('should report error', async () => {
    callable.mockImplementation(() => {
      throw new Error();
    });

    effectProcessor.process(effectAction);

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
    expect(callable).toThrow();
    expect(reportError).toBeCalledTimes(1);
  });

  it('should execute all action even one throw error', async () => {
    const errorAction = new EffectAction(() => {
      throw new Error();
    });

    effectProcessor.process(errorAction);
    effectProcessor.process(effectAction);

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
    expect(reportError).toBeCalledTimes(1);
  });

  it('should not execute action twice', async () => {
    effectProcessor.process(effectAction);
    effectProcessor.process(effectAction);

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
  });

  it('should not execute action twice (microTask)', async () => {
    effectProcessor.process(effectAction);
    effectProcessor.process(effectAction);
    await Promise.resolve();
    Promise.resolve().then(() => effectProcessor.process(effectAction));

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
  });

  it('should  execute action twice (macroTask)', async () => {
    effectProcessor.process(effectAction);
    effectProcessor.process(effectAction);

    setTimeout(() => effectProcessor.process(effectAction));
    await flush();

    expect(callable).toBeCalledTimes(2);
  });
});
