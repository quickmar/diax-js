import { CONTEXT, Context } from "../context/context";
import { throwNowContext } from "../utils/util";

export interface ContextElement extends HTMLElement {
    readonly [CONTEXT]: Context;
}

export function getElementContext(element: ContextElement): Context {
    return element[CONTEXT] ?? throwNowContext(element.localName);
}

export function hasContext(element: object): element is ContextElement {
    return Object.hasOwn(element, CONTEXT) && element instanceof HTMLElement;
}