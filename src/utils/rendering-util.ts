import { RenderingHTMLElement } from '../model/elements';
import { Attributes } from '../rendering/attributes/attribute-name';
import { RenderState } from '../rendering/attributes/render-state';
import { RenderStrategy } from '../rendering/attributes/render-strategy';

export function setState(element: Element, state?: RenderState): void {
  element.setAttribute(Attributes.RENDER_STATE, state ?? '');
}

export function tryRender(element: RenderingHTMLElement): void {
  try {
    element.render();
    element.removeAttribute(Attributes.RENDER_STATE);
  } catch (error) {
    console.error(error);
    setState(element, RenderState.FAILED);
  }
}

export function shouldRejectNode(element: RenderingHTMLElement): boolean {
  return !!element.getAttribute(RenderStrategy.SELF) || !!element.getAttribute(RenderState.DISABLED);
}

export function canRender(node: object): node is RenderingHTMLElement {
  return Reflect.has(node.constructor, 'renderAssociated') && node instanceof HTMLElement;
}

export function hasPendingDetectionState(node: Node): node is Element{
  if (node instanceof Element) {
    return node.getAttribute(Attributes.RENDER_STATE) === RenderState.PENDING;
  }
  return false;
}
