import { CONTEXT } from '../context/context';
import { Context } from './context';

export interface ContextNode extends Node {
  readonly [CONTEXT]: Context;
}

export interface ContextElement extends Element {}
