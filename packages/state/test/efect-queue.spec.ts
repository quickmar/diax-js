import { Mock } from 'vitest';
import { EffectAction } from '../src/actions';
import { EffectQueue } from '../src/queues';
import { asAny } from './util';

describe('EffectQueue', () => {
  let callable: Mock<[]>;
  let effectAction: EffectAction;
  let effectQueue: EffectQueue;

  beforeAll(() => {
    vi.stubGlobal('requestIdleCallback', (fn: VoidFunction) => fn());
    vi.stubGlobal('reportError', vi.fn());
  });

  beforeEach(() => {
    vi.resetAllMocks();
    callable = vi.fn();
    effectAction = new EffectAction(callable);
    effectQueue = new EffectQueue();
  });

  it('should create', () => {
    expect(effectQueue).toBeTruthy();
  });

  it('should put on the queue', () => {
    const spy = vi.spyOn(asAny(effectQueue), 'put');

    effectQueue.schedule(effectAction);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(effectAction);
  });

  it('should execute on microTaskQueue', async () => {
    effectQueue.schedule(effectAction);

    expect(callable).not.toBeCalled();

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
  });

  it('should report error', async () => {
    callable.mockImplementation(() => {
      throw new Error();
    });

    effectQueue.schedule(effectAction);

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
    expect(callable).toThrow();
    expect(reportError).toBeCalledTimes(1);
  });

  it('should execute all action even one throw error', async () => {
    const errorAction = new EffectAction(() => {
      throw new Error();
    });

    effectQueue.schedule(errorAction);
    effectQueue.schedule(effectAction);

    await Promise.resolve();

    expect(callable).toBeCalledTimes(1);
    expect(reportError).toBeCalledTimes(1);
  });
});
