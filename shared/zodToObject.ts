import type { ZodSchema } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

/**
 * Standard ZodSchema to JSON object serializer.
 *
 * Designed to strip out unnecessary fields from the JSON schema to help with
 * reasoning by language models more efficiently.
 */
export function zodToObject(schema: ZodSchema) {
  return Object.fromEntries(
    Object.entries(zodToJsonSchema(schema)).filter(([k]) => k !== '$schema'),
  )
}
