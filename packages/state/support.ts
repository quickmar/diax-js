import { useToken } from '@diax-js/context';
import { newToken } from '@diax-js/common/support';
import { RenderingAction } from './src/actions';

export const RENDERING_ACTION_TOKEN = newToken<RenderingAction>('RENDERING_ACTION');
export { subscribe } from './src/support/subscribe';
export { ActionScheduler } from './src/action-scheduler';
export const produceRenderingAction = (callable: VoidFunction) =>
  useToken(RENDERING_ACTION_TOKEN, () => new RenderingAction(callable));
