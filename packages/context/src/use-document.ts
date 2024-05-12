import { useContext } from './context';
import { DocumentContext } from './document-context';

export const useDocument = (fn: VoidFunction) => {
  useContext(DocumentContext.create(), fn);
};
