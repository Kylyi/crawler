import type { IUtilitiesConfig } from '../core/config/utilities-config.type'
import { extendUtilitiesConfig } from '../core/config/extend-utilities-config'
import { defaultUtilitiesConfig } from '../core/config/default-config'
import { uploadFile } from './utils/upload-file'
import { deleteFile } from './utils/delete-file'

/**
 * Layer-local comparator extensions. Scraped by the Nuxt merge module.
 * Values must be literal (no spreads of imports) so codegen can merge them.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ComparatorEnum = {
  EQUAL: 'eq',
  NOT_EQUAL: 'not.eq',
  IN: 'in',
  NOT_IN: 'not.in',
  LIKE: 'like',
  CONTAINS: 'cs',
  STARTS_WITH: 'stw',
  ENDS_WITH: 'enw',
  NOT_LIKE: 'not.like',
  NOT_CONTAINS: 'not.cs',
  NOT_STARTS_WITH: 'not.stw',
  NOT_ENDS_WITH: 'not.enw',
  GREATER_THAN: 'gt',
  LESS_THAN: 'lt',
  GREATER_THAN_OR_EQUAL: 'gte',
  LESS_THAN_OR_EQUAL: 'lte',
  IS: 'is',
  NOT_IS: 'is.not',
  IN_EVERY: 'in.every',
  IN_NONE: 'in.none',
  IS_EMPTY: 'is.$empty',
  NOT_IS_EMPTY: 'is.not.$empty',
} as const

/**
 * Layer-local data types. Scraped by the Nuxt merge module.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DataTypeValues = [
  'string',
  'number',
  'percent',
  'decimal',
  'currency',
  'duration',
  'date',
  'datetime',
  'yearMonth',
  'timestamp',
  'fullDateTime',
  'boolean',
  'bool',
  'time',
  'custom',
] as const

const defaultConfig = {
  ...defaultUtilitiesConfig,
  files: {
    uploadHandler: async ({ file, requestHandler, onComplete, onError }) => {
      try {
        const result = (await requestHandler?.(() => uploadFile({ file }))) ?? uploadFile({ file })

        file.uploadProgress = 100
        file.hasError = false
        file.uploadedFile = result

        for await (const onUploadComplete of file.onUploadCompleteQueue ?? []) {
          await onUploadComplete(result)
        }

        onComplete?.(result)

        return result
      } catch (error) {
        file.hasError = true
        file.uploadProgress = 0
        file.uploadedFile = undefined
        onError?.(error)

        return null
      }
    },
    deleteHandler: async ({ file, requestHandler, onComplete, onError }) => {
      try {
        const result = (await requestHandler?.(() => deleteFile({ file }))) ?? deleteFile({ file })
        onComplete?.(result)

        return result
      } catch (error) {
        onError?.(error)

        return null
      }
    },
  },
} satisfies IUtilitiesConfig

export default extendUtilitiesConfig(defaultConfig)
