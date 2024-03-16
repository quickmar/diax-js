import { CONTEXT, Context, Dependencies } from '@diax-js/common/context';
import { TargetCallbacks } from '@diax-js/common/custom-element';
import { Signal, Subscription } from '@diax-js/common/state';
import { BaseDependencies } from './element-context';

let documentContext: DocumentContext;

export class DocumentContext implements Context {
  static {
    if (!Object.hasOwn(document, CONTEXT)) {
      Object.assign(document, { [CONTEXT]: new DocumentContext() });
    }
    documentContext = Object.getOwnPropertyDescriptor(document, CONTEXT)?.value;
  }

  static create(): DocumentContext {
    return documentContext;
  }

  get observedAttributes(): Set<string> {
    throw Error('Document Context has no observedAttributes.');
  }

  get host(): never {
    throw Error('Document Context has no host.');
  }

  get attributes(): never {
    throw Error('Document Context has no reactive attributes.');
  }

  readonly instance: TargetCallbacks = {};
  readonly dependencies: Dependencies = new BaseDependencies();
  observables = new Set<Signal<unknown>>();
  ownedSubscriptions: Set<Subscription> = new Set();
  observer = null;
  subscriptionMode = null;

  destroy(): void {
    throw new Error('Document Context can not be destroyed.');
  }
}
