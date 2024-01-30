import { Mock } from 'vitest';
import { ComputationAction } from '../src/actions';
import { ComputationProcessor } from '../src/processors';
import { asAny, flush } from './util';
import { fail } from 'assert';

describe('ComputationProcessor', () => {
  let callable: Mock<[]>;
  let computationAction: ComputationAction;
  let computationProcessor: ComputationProcessor;

  beforeAll(() => {
    vi.stubGlobal('reportError', vi.fn());
  });

  beforeEach(() => {
    vi.resetAllMocks();
    callable = vi.fn();
    computationAction = new ComputationAction(callable);
    computationProcessor = new ComputationProcessor();
  });

  it('should create', () => {
    expect(computationProcessor).toBeTruthy();
  });

  it('should put on the processor', () => {
    const spy = vi.spyOn(asAny(computationProcessor), 'put');

    computationProcessor.process(computationAction);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(computationAction);
  });

  it('should execute synchronously', async () => {
    computationProcessor.process(computationAction);

    expect(callable).toBeCalledTimes(1);

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
  });

  it('should report error', async () => {
    callable.mockImplementation(() => {
      throw new Error();
    });

    computationProcessor.process(computationAction);

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
    expect(callable).toThrow();
    expect(reportError).toBeCalledTimes(1);
  });

  it('should execute all actions even one throw error', () => {
    const errorAction = new ComputationAction(() => {
      throw new Error();
    });

    computationProcessor.process(errorAction);
    computationProcessor.process(computationAction);

    expect(callable).toBeCalledTimes(1);
    expect(reportError).toBeCalledTimes(1);
  });

  it('should report when exceeded computation budged', () => {
    let action: ComputationAction | null = null;
    let action1: ComputationAction | null = null;

    action = new ComputationAction(() => action1?.schedule());
    action1 = new ComputationAction(() => action?.schedule());

    if (action1) {
      const cyclicActon = action1;
      expect(() => computationProcessor.process(cyclicActon)).not.toThrow();
      expect(reportError).toBeCalledTimes(1);
      expect(reportError).toBeCalledWith(new RangeError('Computation budged (1000) exceeded.'));
    } else fail();
  });

  it('should  execute action as many times as requested', async () => {
    computationProcessor.process(computationAction);
    computationProcessor.process(computationAction);

    setTimeout(() => computationProcessor.process(computationAction));
    await flush();

    expect(callable).toBeCalledTimes(3);
  });
});
