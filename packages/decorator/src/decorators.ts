import { CustomElementDecorator } from '@diax-js/common/custom-element';
import { attachShadow, attachListener } from '@diax-js/context/host';
import { __addAfterHostFn } from '@diax-js/common/decorator';

export function AttachShadow(init: ShadowRootInit = { mode: 'open' }): CustomElementDecorator {
  return function (target, { metadata, addInitializer }) {
    addInitializer(function () {  
      const x = this;
      console.log(x);
      console.log(x === target);
      });
    __addAfterHostFn(metadata, () => attachShadow(init));
  };
}
