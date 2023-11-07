import { useHost } from '@diax-js/context/host';
import { hasPendingDetectionState, isRenderAssociated } from '../utils/rendering-util';
import { Attributes } from './attributes/attribute-name';
import { RenderStrategy } from './attributes/render-strategy';
import { DocumentWalker } from './strategy/document-walker';
import { SelfWalker } from './strategy/self-walker';
import { SubTreeWalker } from './strategy/sub-tree-walker';

const renderStateObserver: MutationObserver = new MutationObserver(checkMutations);
const selfWalker = new SelfWalker();
const subTreeWalker = new SubTreeWalker();
const documentWalker = new DocumentWalker(subTreeWalker);
renderStateObserver.observe(document.body, { attributeFilter: [Attributes.RENDER_STATE] });

function checkMutations(mutations: MutationRecord[]): void {
  for (const record of mutations) {
    const { target } = record;
    if (!hasPendingDetectionState(target)) continue;
    const strategy = target.getAttribute(Attributes.RENDER_STRATEGY);
    try {
      switch (strategy) {
        case RenderStrategy.SELF:
          return selfWalker.walk(target);
        case RenderStrategy.document:
          return documentWalker.walk();
        case RenderStrategy.SUBTREE:
          return subTreeWalker.walk(target);
        default: documentWalker.walk();
      }
    } finally {
      if (!isRenderAssociated(target)) {
        target.removeAttribute(Attributes.RENDER_STATE);
      }
    }
  }
}

export const attachRendering = () => {
  renderStateObserver.observe(useHost(), { attributeFilter: [Attributes.RENDER_STATE] });
};
