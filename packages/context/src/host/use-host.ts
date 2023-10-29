import { getCurrentContext } from '../context';

export const useHost = () => {
  return getCurrentContext().host;
};
