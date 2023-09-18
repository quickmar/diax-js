import { ContextElement } from "../model/elements";

export interface Context {}

export const CONTEXT = Symbol('context');

let currentContext: Context | null = null;

export const useContext = (context: Context, fn: VoidFunction) => {
  try {
    currentContext = context;
    fn();
  } finally {
    currentContext = null;
  }
};

export function hasContext(element: object): element is ContextElement {
    return Object.hasOwn(element, CONTEXT) && element instanceof HTMLElement;
}
