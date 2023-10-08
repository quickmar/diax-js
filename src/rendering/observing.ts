import { useDocument } from '../context/use-document';
import { useSelf } from '../context/use-self';
import { useSupplier } from '../context/use-supplier';
import { hasPendingDetectionState } from '../utils/rendering-util';
import { Attributes } from './attributes/attribute-name';
import { RenderStrategy } from './attributes/render-strategy';
import { DocumentWalker } from './strategy/document-walker';
import { SelfWalker } from './strategy/self-walker';
import { SubTreeWalker } from './strategy/sub-tree-walker';

const renderStateObserver: MutationObserver = new MutationObserver(checkMutations);
const selfWalker = new SelfWalker();
const subTreeWalker = new SubTreeWalker();
const documentWalker = new DocumentWalker();

useDocument(() => {
  useSupplier(SelfWalker, () => selfWalker);
  useSupplier(SubTreeWalker, () => subTreeWalker);
  useSupplier(DocumentWalker, () => documentWalker);
});

function checkMutations(mutations: MutationRecord[]): void {
  for (const record of mutations) {
    const { target } = record;
    if (!hasPendingDetectionState(target)) continue;
    const strategy = target.getAttribute(Attributes.RENDER_STRATEGY);
    switch (strategy) {
      case RenderStrategy.SUBTREE:
        return subTreeWalker.walk(target);
      case RenderStrategy.SELF:
        return selfWalker.walk(target);
      case RenderStrategy.APP:
      default:
        return documentWalker.walk();
    }
  }
}

export const attachRendering = () => {
  renderStateObserver.observe(useSelf(HTMLElement), { attributeFilter: [Attributes.RENDER_STATE] });
};
