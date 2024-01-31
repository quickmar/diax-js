import { CONTEXT, ContextElement } from '@diax-js/common';
import { ElementContext } from '@diax-js/context';

export function createContextElement(tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = document.createElement(tagName);
  return Object.assign(element, { [CONTEXT]: new ElementContext(element) });
}

export function createContextElementFromString(html: string, tagName: keyof HTMLElementTagNameMap): ContextElement {
  const element = createContextElement(tagName);
  element.innerHTML = html;
  for (const node of element.querySelectorAll('[context]')) {
    Object.assign(node, { [CONTEXT]: new ElementContext(node as HTMLElement) });
  }
  return element;
}

export async function flush() {
  await new Promise((resolve) => setTimeout(resolve));
}
