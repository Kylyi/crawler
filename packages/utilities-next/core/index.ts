// Config
export {
  defineUtilitiesConfig,
  getUtilitiesConfig,
  setUtilitiesConfig,
  mergeUtilitiesConfig,
} from './config/runtime-config'
export { extendUtilitiesConfig } from './config/extend-utilities-config'
export { customDefu } from './config/custom-defu'
export { defaultUtilitiesConfig } from './config/default-config'
export type { IUtilitiesConfig, TranslateFn } from './config/utilities-config.type'

// Enums
export { ComparatorEnum } from './enums/comparator.enum'
export { DataTypeValues, type DataType, type SimpleDataType, type ExtendedDataType } from './enums/data-type'
export { DayEnum } from './enums/day.enum'
export { SummaryEnum } from './enums/summary.enum'

// Utils
export { $date, $duration, dayjs, type Dayjs } from './utils/$date'
export { tMarker } from './utils/t-marker'
export { generateUUID } from './utils/generate-uuid'
export { isDev } from './utils/is-dev'
export { isNumeric } from './utils/is-numeric'
export { isUrl } from './utils/is-url'
export { isValidDate } from './utils/is-valid-date'
export { isBooleanish } from './utils/is-booleanish'
export { normalizeText } from './utils/normalize-text'
export { createTextShortcut } from './utils/create-text-shortcut'
export { replaceNonAlphanumeric } from './utils/replace-non-alphanumeric'
export { safelyEvaluate } from './utils/safely-evaluate'
export { traverseChildren } from './utils/traverse-children'
export { arkError, translateArkError } from './utils/translate-ark-error'
export { parseValue } from './utils/parse-value'
export { getDateTypes, getNumberDataTypes } from './utils/data-types'
export { cleanObject } from './utils/clean-object'
export { cleanValue } from './utils/clean-value'
export { mergeFast } from './utils/merge-fast'
export { mergeWith } from './utils/merge-with'
export { getFast } from './utils/get-fast'
export { setFast } from './utils/set-fast'
export { extractObjectKeys } from './utils/extract-object-keys'
export { transliterate } from './utils/transliterate'
export { makeSelectorOptionsFromEnum } from './utils/make-options-from-enum'
export { $log } from './utils/$log'

// Functions
export { filterData, type IFilterDataItem } from './functions/filter-data'
export { predictDataType } from './functions/predict-data-type'
export { findInNested } from './functions/find-in-nested'
export { highlight as highlightText, highlight } from './functions/highlight-text'
export { getElementSize } from './functions/get-element-size'
export { removeDatetimeSpaces } from './functions/remove-datetime-spaces'
export { buildZodFromJson } from './functions/build-zod-from-json'
export { translateZodIssue } from './functions/translate-zod-issue'
export { translateNestedKey } from './functions/translate-nested-key'

// Constants
export { getComparatorsByDataType } from './constants/comparators-by-datatype.const'
export {
  getNonValueComparators,
  getBooleanishComparators,
  getSelectorComparators,
} from './constants/comparators-by-category.const'
export { getDefaultComparatorByDataType } from './constants/default-comparator-by-data-type.const'

// Models
export { FilterItem } from './models/filter-item.model'
export { SortItem } from './models/sort-item.model'
export { GroupItem } from './models/group-item.model'
export { SummaryItem } from './models/summary-item.model'
export { FileModel } from './models/file.model'
export { Day } from './models/day.model'
export { BaseTableColumn } from './models/base-table-column.model'

// Types
export type { IItem } from './types/item.type'
export type { Datetime } from './types/datetime.type'
export type { ObjectKey } from './types/object-key.type'
export type { IFormatValueOptions } from './types/format-value-options.type'
export type { PredictDataTypeOptions } from './types/predict-data-type-options.type'
export type { Period } from './types/period.type'
export type { IOrderBy } from './types/order-by.type'

// i18n helpers (messages themselves are in package i18n/)
export * from './i18n'
