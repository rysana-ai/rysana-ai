import type { ZodType } from 'zod'

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
