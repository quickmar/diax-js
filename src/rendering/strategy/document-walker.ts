import { SubTreeWalker } from './sub-tree-walker';

export class DocumentWalker extends SubTreeWalker {
  override walk(): void {
    super.walk(document);
  }
}
