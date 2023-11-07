import { DetectionWalker } from './detection-walker';
import { canRender, shouldRejectNode, tryRender } from '../../utils/rendering-util';
import { RenderingHTMLElement } from '@diax-js/common';

export class SubTreeWalker implements DetectionWalker {
  walk(root: Node): void {
    const iterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, this);
    let nextNode = iterator.nextNode() as RenderingHTMLElement | null;
    while (nextNode) {
      if (nextNode.shadowRoot !== null) {
        this.walk(nextNode.shadowRoot);
      } else {
        tryRender(nextNode);
      }
      nextNode = iterator.nextNode() as RenderingHTMLElement | null;
    }
  }

  acceptNode(node: Element): number {
    if (canRender(node)) {
      if (shouldRejectNode(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
    if (node.shadowRoot !== null) return NodeFilter.FILTER_ACCEPT;
    return NodeFilter.FILTER_SKIP;
  }
}
