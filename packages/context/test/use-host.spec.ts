import { describe, it, expect } from 'vitest';
import { useHost } from '../src/host/use-host';
import { useContext } from '../src/context';

describe('useHost', () => {
  it('should return the host from current context', () => {
    useContext(Object({ host: { id: 'test-host' } }), () => {
      const host = useHost();

      expect(host).toEqual({ id: 'test-host' });
    });
  });
});
