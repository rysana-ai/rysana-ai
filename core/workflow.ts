import type { Actions } from '~/core/action'

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
