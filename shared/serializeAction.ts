import type { Action } from '~/core/action'
import { zodToObject } from '~/shared/zodToObject'

// TODO: TODO/23062023
/**
 * Used to serialize an action on the client as a JSON string, so that it can be
 * passed through the API proxy and to the reasoning engine for reasoning.
 */
export function serializeAction<TInput, TOutput, TMetadata>(
  name: string,
  action: Action<TInput, TOutput, TMetadata>,
): string {
  return JSON.stringify({
    name: action.name ?? name,
    description: action.description,
    input:
      action.arity === 'unary' ? zodToObject(action.inputParser) : undefined,
    output: action.outputParser ? zodToObject(action.outputParser) : undefined,
  })
}
