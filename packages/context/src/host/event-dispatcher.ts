import { useHost } from './use-host';

export class EventDispatcher implements Pick<EventTarget, 'dispatchEvent'> {
  host = useHost();

  dispatchEvent(event: Event): boolean {
    return this.host.dispatchEvent(event);
  }
}
