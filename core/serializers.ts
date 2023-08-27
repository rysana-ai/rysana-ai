import { zodToJsonSchema } from 'zod-to-json-schema'
import type { AnyAction } from '~/core/action'
import type { AnyApp } from '~/core/app'
import { mapEntries } from '~/shared/records'

/** Used to serialize an `Action` into a JSON object. */
export function serializeAction(name: string, action: AnyAction) {
  return {
    name: action.name ?? name,
    description: action.description,
    input: action.arity === 'unary' ? zodToJsonSchema(action.inputParser) : undefined,
    output: action.outputParser ? zodToJsonSchema(action.outputParser) : undefined,
  }
}

/** Used to serialize an `App` into a JSON object. */
export function serializeApp(app: AnyApp) {
  return {
    description: app.description,
    actions: app.actions
      ? mapEntries(app.actions, ([name, action]) => [name, serializeAction(name, action)])
      : undefined,
    models: app.models
      ? mapEntries(app.models, ([name, model]) => [name, zodToJsonSchema(model)])
      : undefined,
    examples: app.examples,
  }
}
