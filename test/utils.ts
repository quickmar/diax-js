import { CONTEXT } from '../src/context/context';
import { ElementContext } from '../src/context/element-context';
import { ContextElement } from '../src/model/elements';

export function createContextElement(tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = document.createElement(tagName);
  Reflect.set(element, CONTEXT, new ElementContext());
  return element as ContextElement;
}
