import { useContext } from './packages/context/dist/src/context';
import { afterEach, beforeEach } from 'vitest';

beforeEach((vitestCtx) => {
  Object.assign(vitestCtx, { useContext });
});

afterEach((vitestCtx) => {
  Object.assign(vitestCtx, { useContext: null });
});
