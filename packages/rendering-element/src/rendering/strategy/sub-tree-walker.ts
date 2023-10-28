import { DetectionWalker } from './detection-walker';
import { canRender, shouldRejectNode, tryRender } from '../../utils/rendering-util';
import { RenderingHTMLElement } from '@diax/common';

export class SubTreeWalker implements DetectionWalker {
  walk(root: Node): void {
    const iterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, this);
    let nextNode = iterator.nextNode() as RenderingHTMLElement | null;
    while (nextNode) {
      tryRender(nextNode);
      if (nextNode.shadowRoot !== null) {
        this.walk(nextNode.shadowRoot);
      }
      nextNode = iterator.nextNode() as RenderingHTMLElement | null;
    }
  }

  acceptNode(node: Node): number {
    if (canRender(node)) {
      if (shouldRejectNode(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
    return NodeFilter.FILTER_SKIP;
  }
}
