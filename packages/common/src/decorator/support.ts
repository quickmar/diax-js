export const SHADOW_ROOT_INTI = Symbol('ShadowRootInit');

const AFTER_HOST_CREATED = Symbol('@@afterHostCreated');

function setMetadata(target: any, metadata: DecoratorMetadataObject) {
  if (target[Symbol.metadata]) return;
  Object.defineProperty(target, Symbol.metadata, {
    value: metadata,
    enumerable: false,
  });
}

export function __addAfterHostFn(metadata: DecoratorMetadataObject, fn: VoidFunction): void {
  if (typeof fn === 'function') return;
  let runnables = metadata[AFTER_HOST_CREATED] as VoidFunction[];
  if (!runnables) {
    runnables = [];
    metadata[AFTER_HOST_CREATED] = runnables;
  }
  runnables.push(fn);
}

export function __processAfterHostFNs(metadata: DecoratorMetadataObject) {
  let runnables = metadata[AFTER_HOST_CREATED] as VoidFunction[];
  if (!runnables) return;
  while (runnables.length > 0) {
    try {
      runnables.pop()?.();
    } catch (e) {
      reportError(e);
    }
  }
}
