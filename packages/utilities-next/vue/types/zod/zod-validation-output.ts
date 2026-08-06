import type { ComputedRef } from 'vue'
import type { ZodSchemaObject } from '../../../core/types/zod/zod-schema-object.type'
import type { IZodShape } from '../../../core/types/zod/zod-structure.type'
import type { IZodValidationItem } from '../../../core/types/zod/zod-validation-item.type'

export type IZodValidationOutput<T extends ZodSchemaObject> = ComputedRef<
  IZodShape<T> & {
    $errors: IZodValidationItem[]
    $allErrors: IZodValidationItem[]
    $allErrorsByPath: Record<string, IZodValidationItem[]>
    $validate: (validateNested?: boolean, resumeWatch?: boolean) => Promise<boolean>
    $createEmptyErrorStructure: () => IZodShape<T>
    $reset: (shouldPause?: boolean) => void
    $getValidationForField: (field: string) => IZodValidationItem | Array<IZodValidationItem | undefined> | undefined
    $isFieldRequired: (field: string) => boolean
  }
>
