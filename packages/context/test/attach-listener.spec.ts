import { Context } from '@diax-js/common/context';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { attachListener } from '../src/host/attach-listener';
import { getCurrentContext } from '../src/context';

vi.mock('../src/context.ts', () => ({
  getCurrentContext: vi.fn(),
}));

describe('attachListener', () => {
  let mockHost: HTMLElement;
  let mockOwnedSubscriptions: Set<any>;

  beforeEach(() => {
    mockHost = document.createElement('div');
    mockOwnedSubscriptions = new Set();

    vi.mocked(getCurrentContext).mockReturnValue({
      host: mockHost,
      ownedSubscriptions: mockOwnedSubscriptions,
    } as Context);
  });

  it('should attach event listener to host element', () => {
    const listener = vi.fn();
    const spy = vi.spyOn(mockHost, 'addEventListener');

    attachListener('click', listener, {});

    expect(spy).toHaveBeenCalledWith('click', expect.any(Function), {});
  });

  it('should add subscription to ownedSubscriptions', () => {
    const listener = vi.fn();

    attachListener('click', listener, {});

    expect(mockOwnedSubscriptions.size).toBe(1);
  });

  it('should remove event listener when unsubscribe is called', () => {
    const listener = vi.fn();
    const spy = vi.spyOn(mockHost, 'removeEventListener');

    const unsubscribe = attachListener('click', listener, {});
    unsubscribe();

    expect(spy).toHaveBeenCalledWith('click', expect.any(Function), {});
  });

  it('should clean up subscription properties after unsubscribe', () => {
    const listener = vi.fn();

    const unsubscribe = attachListener('click', listener, {});
    unsubscribe();

    const subscription = Array.from(mockOwnedSubscriptions)[0];
    expect(subscription.host).toBeNull();
    expect(subscription.listener).toBeNull();
    expect(subscription.options).toBeNull();
    expect(subscription.type).toBeNull();
  });

  it('should properly handle event when triggered', () => {
    const listener = vi.fn();

    attachListener('click', listener, {});
    mockHost.click();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(expect.any(MouseEvent));
  });
});
