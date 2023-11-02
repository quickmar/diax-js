import { DetectionWalker } from './detection-walker';
import { SubTreeWalker } from './sub-tree-walker';

export class DocumentWalker implements DetectionWalker {
  constructor(private readonly subTreeWalker: SubTreeWalker) {}

  walk(): void {
    this.subTreeWalker.walk(document);
  }
}
