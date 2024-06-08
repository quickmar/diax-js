import { newToken } from '../context/support';
import { DisabledFeatures } from './model';

/**
 * This token is used to disable features in the application.
 *
 * @type {Token<DisabledFeatures>}
 */
export const DISABLED_FEATURES = newToken<DisabledFeatures>('DISABLED_FEATURES');
