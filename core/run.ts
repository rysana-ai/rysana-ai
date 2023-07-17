/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Actions, AnyAction } from '~/core/action'
import type { App } from '~/core/app'
import type { Workflow } from '~/core/workflow'

export async function run<
  TActions extends Actions,
  TApp extends App<TActions, any, any>,
  TWorkflow extends Workflow<TActions>,
>(app: TApp, workflow: TWorkflow) {
  const temp = new Map()
  const actions = app.actions as Record<string, AnyAction> | undefined
  try {
    if (!actions) throw new Error('Missing actions.')
    for (const step of workflow) {
      let input = step.input as Record<string, any> | string | null
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
