import { CONTEXT, Context } from "../context/context";

export interface ContextElement extends HTMLElement {
    readonly [CONTEXT]: Context;
}
