import type { Actions } from '~/core/action'
import type { App } from '~/core/app'
import type { Models } from '~/core/model'
import type { Workflow } from '~/core/workflow'

/** Run a `Workflow` against an `App`. */
export async function run<
  TActions extends Actions,
  TApp extends App<TActions, Models, any>,
  TWorkflow extends Workflow<TActions>,
>(app: TApp, workflow: TWorkflow) {
  const temp = new Map()
  const actions = app.actions as Actions | undefined
  try {
    if (!actions) throw new Error('Missing actions.')
    for (const step of workflow) {
      let input = step.input as Record<string, unknown> | string | null
      const { action, saveAs } = step
      if (
        typeof input === 'string' &&
        /^{{(.+)}}$/.test(input) &&
        temp.has(input.slice(2, -2))
      ) {
        input = temp.get(input)
      } else if (typeof input === 'object' && input !== null) {
        for (const [key, value] of Object.entries(input)) {
          if (
            typeof value === 'string' &&
            /^{{(.+)}}$/.test(value) &&
            temp.has(value.slice(2, -2))
          ) {
            input[key] = temp.get(value)
          }
        }
      }
      const result = await actions[action].call(input)
      if (saveAs) temp.set(saveAs, result)
    }
  } catch (error) {
    app.handleError?.(error)
  }
}
