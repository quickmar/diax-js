import { CustomElementDecoratorMetadata } from './model';

export type RunnableKey = keyof Pick<
  CustomElementDecoratorMetadata,
  'connected' | 'disconnected' | 'created' | 'adopted'
>;

/**
 * Executes metadata hooks defined in the given metadata object.
 *
 * This function retrieves the hooks from the metadata object using the specified key.
 * It checks if the hooks exist and are stored in an array. Then, each hook is invoked
 * with the entire metadata object as its argument. If a hook throws an error during its
 * execution, the error is caught and passed to the reportError function.
 *
 * @param metadata - The metadata object that may contain an array of hooks.
 * @param key - The key of the metadata object where the hooks array is stored.
 */
export function runMetadataHooks<T>(this: T, metadata: CustomElementDecoratorMetadata, key: RunnableKey): void {
  const hooks = metadata[key];
  if (!hooks || !Array.isArray(hooks)) {
    return;
  }
  for (const hook of hooks) {
    callHook.call(this, hook);
  }
}

/**
 * Adds a hook function to the metadata object under the specified key.
 * If the key doesn't exist in the metadata object, it creates a new array and adds the hook to it.
 *
 * @param metadata - The decorator metadata object to add the hook to
 * @param key - The key under which the hook should be stored
 * @param hook - The function to be added as a hook
 */
export function addMetadataHook(metadata: CustomElementDecoratorMetadata, key: RunnableKey, hook: VoidFunction): void {
  let hooks = metadata[key] as VoidFunction[];
  if (!hooks) {
    hooks = [];
    metadata[key] = hooks;
  }
  hooks.push(hook);
}

function callHook<T>(this: T, hook: VoidFunction): void {
  try {
    hook.call(this);
  } catch (error) {
    reportError(error);
  }
}
