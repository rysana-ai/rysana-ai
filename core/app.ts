import type { Actions } from '~/core/action'
import type { Examples } from '~/core/example'
import type { Models } from '~/core/model'

/** A Lusat app. */
export type App<TActions extends Actions, TModels extends Models, TMeta> = {
  description?: string
  metadata?: TMeta
  actions?: TActions
  examples?: Examples<TActions>
  models?: TModels
  handleError?: (error: unknown) => void
}

/**
 * Util to type-check a Lusat app.
 *
 * ```ts
 * app({
 *  actions: // ...,
 *  examples: // ...,
 *  models: // ...,
 * })
 * ```
 */
export function app<
  TActions extends Actions,
  TModels extends Models,
  TMeta,
  TApp extends App<TActions, TModels, TMeta>,
>(def: TApp) {
  return { handleError: console.error, ...def }
}
