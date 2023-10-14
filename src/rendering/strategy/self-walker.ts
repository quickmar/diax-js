import { canRender, shouldRejectNode, tryRender } from '../../utils/rendering-util';
import { DetectionWalker } from './detection-walker';

export class SelfWalker implements DetectionWalker {
  walk(root: Node): void {
    if (canRender(root) && !shouldRejectNode(root)) {
      tryRender(root);
    }
  }
}
