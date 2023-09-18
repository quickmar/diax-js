import { CONTEXT, Context, hasContext } from "./context"
import { useElement } from "./use-element";

export const useDocument = (fn: VoidFunction) => {
    const doc = document;
    let context: Context | null = null;
    if (!hasContext(doc)) {
        context = null;
        Reflect.set(doc, CONTEXT, context);
    } else {
        context = Reflect.get(doc, CONTEXT);
    }
    useElement(doc, fn);
}