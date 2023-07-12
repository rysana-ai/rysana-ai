import type { ZodType } from 'zod'
import type { Actions } from '~/core/action'

/**
 * Util to type-check a set of actions.
 *
 * ```ts
 * actions({
 *  createTodo: action()
 *    .input(z.string())
 *    .handle((input) => {/*...*\/}),
 * ```
 */
export function actions<T extends Actions>(def: T) {
  return def
}

/** A program that can be executed by Lusat. */
export type Workflow<T extends Actions> = {
  action: keyof T
  input?: unknown
  saveAs?: string
}[]

/**
 * Util to type-check a workflow.
 *
 * ```ts
 * workflow([{ action: 'createTodo', input: 'Sleep' }])
 * ```
 */
export function workflow<T extends Actions>(def: Workflow<T>) {
  return def
}

/** An example user prompt and workflow, used for testing and reasoning. */
export type Example<T extends Actions> = {
  prompt: string
  workflow: Workflow<T>
}

/** A set of examples, used for testing and reasoning. */
export type Examples<T extends Actions> = Record<string, Example<T>>

/**
 * Util to type-check a set of examples.
 *
 * ```ts
 * examples({
 *   createTodo: {
 *     prompt: 'Remind me to sleep',
 *     workflow: [{ action: 'createTodo', input: 'Sleep' }],
 *   },
 * })
 * ```
 */
export function examples<T extends Actions>(def: Examples<T>) {
  return def
}

/**
 * A record of data shape definitions, used for type-checking and
 * parsing/validation.
 */
export type Models = Record<string, ZodType>

/**
 * Util to type-check a set of models.
 *
 * ```ts
 * models({
 *   Todo: z.object({ title: z.string() }),
 * })
 * ```
 */
export function models<T extends Models>(def: T) {
  return def
}

/** A Lusat app. */
export type App<
  TActions extends Actions,
  TModels extends Models,
  TMeta,
> = {
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
  return {
    handleError: console.error,
    ...def,
  }
}
