import { CONTEXT } from '../src/context/context';
import { ElementContext } from '../src/context/element-context';
import { ContextElement } from '../src/model/elements';

export function createContextElement(tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = document.createElement(tagName);
  Reflect.set(element, CONTEXT, new ElementContext());
  return element as ContextElement;
}

export function createContextElementFromString(html: string, tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = createContextElement(tagName);
  element.innerHTML = html;
  for (const node of element.querySelectorAll('[context]')) {
    const context = new ElementContext();
    context.dependencies.setInstance(HTMLElement, node);
    Reflect.set(node, CONTEXT, context);
  }
  return element as ContextElement;
}
