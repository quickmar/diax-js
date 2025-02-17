import { describe, it, expect, vi } from 'vitest';
import { attachShadow } from '../src/host/attach-shadow';
import { useHost } from '../src/host/use-host';
import { useSupplier } from '../src/use-supplier';

vi.mock('../src/host/use-host.ts', () => ({
  useHost: vi.fn(),
}));

vi.mock('../src/use-supplier.ts', () => ({
  useSupplier: vi.fn(),
}));

describe('attachShadow', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('should create and return new shadow root if one does not exist', () => {
    const mockShadowRoot = {};
    const mockHost = {
      shadowRoot: null,
      attachShadow: vi.fn().mockReturnValue(mockShadowRoot),
    } as unknown as HTMLElement;

    vi.mocked(useHost).mockReturnValue(mockHost);
    const mockUseSupplier = vi.mocked(useSupplier);

    const init = { mode: 'open' } as ShadowRootInit;
    const result = attachShadow(init);

    expect(mockHost.attachShadow).toHaveBeenCalledWith(init);
    expect(mockUseSupplier).toHaveBeenCalledWith(ShadowRoot, expect.any(Function));
    expect(result).toBe(mockShadowRoot);
  });

  it('should return existing shadow root if one already exists', () => {
    const existingShadowRoot = {};
    const mockHost = {
      shadowRoot: existingShadowRoot,
      attachShadow: vi.fn(),
    } as unknown as HTMLElement;

    vi.mocked(useHost).mockReturnValue(mockHost);
    const mockUseSupplier = vi.mocked(useSupplier);

    const result = attachShadow({ mode: 'open' });

    expect(mockHost.attachShadow).not.toHaveBeenCalled();
    expect(mockUseSupplier).not.toHaveBeenCalled();
    expect(result).toBe(existingShadowRoot);
  });
});
