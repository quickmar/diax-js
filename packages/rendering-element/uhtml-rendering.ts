import { RenderResult as IRenderResult } from '@diax-js/common/rendering';
import { useSelf } from '@diax-js/context';
import { Hole, html as _html, render as _render } from 'uhtml';

export class RenderResult implements IRenderResult<Hole> {
  result: Hole | null = null;
}

interface Html {
  (template: TemplateStringsArray, ...values: unknown[]): IRenderResult<Hole>;
}

export const html: Html = (template, ...values) => {
  const currentHole = useSelf(RenderResult);
  const hole = _html(template, ...values);

  if (currentHole.result !== hole) {
    currentHole.result = hole;
  }
  return currentHole;
};

export const render = _render;
