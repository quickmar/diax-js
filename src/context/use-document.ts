import { useContext } from './context';
import { DocumentContext } from './document-context';

export const useDocument = (fn: VoidFunction) => {
  const context = DocumentContext.create();
  useContext(context, fn);
};
