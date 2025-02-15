import { CustomElementDecoratorMetadata } from './model';

type HookKey = keyof Pick<CustomElementDecoratorMetadata, 'onHostCreated' | 'onConnected' | 'onDisconnected'>;

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
export function runMetadataHooks(metadata: DecoratorMetadataObject, key: HookKey): void {
  const hooks = metadata[key];
  if (!hooks || !Array.isArray(hooks)) {
    return;
  }
  for (const hook of hooks) {
    try {
      hook(metadata);
    } catch (error) {
      reportError(error);
    }
  }
}

export function addMetadataHook(metadata: DecoratorMetadataObject, key: HookKey, hook: VoidFunction): void {
  let hooks = metadata[key] as VoidFunction[];
  if (!hooks) {
    metadata[key] = [];
  }
  hooks.push(hook);
}
