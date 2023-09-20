import { CONTEXT } from "../context/context";
import { Context } from "./context";

export interface ContextElement extends HTMLElement {
    readonly [CONTEXT]: Context;
}
