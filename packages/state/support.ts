import { useToken } from '@diax-js/context';
import { RenderingAction } from './src/actions';
import { newToken } from '@diax-js/common';

export const RENDERING_ACTION_TOKEN = newToken<RenderingAction>('RENDERING_ACTION');
export { subscribe } from './src/support/subscribe';
export { ActionScheduler } from './src/action-scheduler';
export const produceRenderingAction = (callable: VoidFunction) =>
  useToken(RENDERING_ACTION_TOKEN, () => new RenderingAction(callable));
