import { useElement } from '../use-element';
import { useHost } from './use-host';

type Input = Parameters<HTMLElement['addEventListener']>;
type AttachListener = (type: Input[0], listener: Input[1], options?: Input[2]) => VoidFunction;

export const attachListener: AttachListener = (type, listener, options) => {
  const host = useHost();
  const actualListener: Input[1] = function (this: HTMLElement, event: Event) {
    let result;
    useElement(this, () => {
      if (typeof listener === 'function') {
        result = listener(event);
      } else {
        result = listener.handleEvent(event);
      }
    });
    return result;
  };

  host.addEventListener(type, actualListener, options);

  return () => host.removeEventListener(type, actualListener, options);
};
