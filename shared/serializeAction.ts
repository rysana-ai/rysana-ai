import type { Action } from '~/core/action'

import { zodToObject } from '~/shared/zodToObject'

// TODO: TODO/23062023
/**
 * Used to serialize an action on the client as a JSON string, so that
 * it can be passed through the API proxy and to the reasoning engine
 * for reasoning.
 */
export function serializeAction<TInput, TOutput, TMetadata>(
  name: string,
  action: Action<TInput, TOutput, TMetadata>,
): string {
  return JSON.stringify({
    name: action.name ?? name,
    description: action.description,
    input:
      action._args === 'unary'
        ? zodToObject(action._inputParser)
        : undefined,
    output: action._outputParser
      ? zodToObject(action._outputParser)
      : undefined,
  })
}
