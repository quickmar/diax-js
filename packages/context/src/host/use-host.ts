import { getCurrentContext } from '../context';

/**
 * Retrieves the host from the current execution context.
 *
 * This function accesses the global context and returns the associated host.
 *
 * @returns The host object from the current context.
 */
export const useHost = () => {
  return getCurrentContext().host;
};
