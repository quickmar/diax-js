import { CONTEXT } from '../src/context/context';
import { ElementContext } from '../src/context/element-context';
import { ContextElement } from '../src/model/elements';

export function createContextElement(tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = document.createElement(tagName);
  return Object.assign(element, { [CONTEXT]: new ElementContext(element) });
}

export function createContextElementFromString(html: string, tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = createContextElement(tagName);
  element.innerHTML = html;
  for (const node of element.querySelectorAll('[context]')) {
    Object.assign(element, { [CONTEXT]: new ElementContext(node) });
  }
  return element;
}
