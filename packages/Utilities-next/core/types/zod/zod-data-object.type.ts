import type { z } from 'zod'
import type { ZodSchemaObject } from './zod-schema-object.type'

/**
 * Core data-object shape uses plain inferred types.
 * Vue wrappers that need `MaybeRefOrGetter` live under `vue/types/zod`.
 */
export type ZodDataObject<T extends ZodSchemaObject> = {
  [P in keyof T]: z.infer<T[P]>
}
