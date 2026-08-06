import { ComparatorEnum } from '../../core/enums/comparator.enum'
import type { ExtendedDataType } from '../../core/enums/data-type'
import { getUtilitiesConfig } from '../../core/config/runtime-config'
import { parseValue } from '../../core/utils/parse-value'
import { transliterate } from '../../core/utils/transliterate'

// Types
import type { IItem } from '../../core/types/item.type'

// Models
import type { FilterItem } from '../../core/models/filter-item.model'
import { getDateTypes } from '../../core/utils/data-types'

// Functions
import { useText } from './useText'
import { filterData as filterDataCore } from '../../core/functions/filter-data'
import { isNil } from 'lodash-es'
import { $date } from '../../core/utils/$date'
import { toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

type IFilter<T> = Pick<
  FilterItem<T>,
  'field' | 'filterField' | 'value' | 'comparator' | 'dataType' | 'filteredKeys' | 'filterFormat' | 'format'
>

export function useFiltering() {
  const { normalizeText } = useText()

  const filterDataCoreFn = <T extends IItem = IItem>(
    data: T[],
    filters: IFilter<T>[],
    rowKey = 'id',

    options?: {
      runAll?: boolean
      onInvalid?: (filter: any, row: T) => void
      transliterate?: boolean
      useUtc?: boolean
      dateTypes?: ExtendedDataType[]
    },
  ) => {
    const { runAll = false, onInvalid, transliterate = false, useUtc, dateTypes = getDateTypes() } = options ?? {}

    return filterDataCore({
      data,
      filters,
      rowKey,
      normalizeText,
      transliterate,
      runAll,
      onInvalid,
      useUtc,
      dateTypes,
    })
  }

  const handleFilter = (
    comparator: ComparatorEnum,
    rowValue: any,
    value: any,
    dataType?: ExtendedDataType,
    options: {
      transliterate?: boolean
      useUtc?: boolean
      dateTypes?: ExtendedDataType[]
    } = {},
  ) => {
    const textFnc = options.transliterate ? transliterate : normalizeText

    const dateTypes = options.dateTypes ?? getDateTypes()

    let valid = true
    let formattedRowValue = rowValue
    let formattedValue = value

    if (dataType) {
      formattedRowValue = parseValue(rowValue, dataType, { dateFormat: 'YYYY-MM-DD', useUtc: options.useUtc })
      formattedValue = parseValue(value, dataType, { dateFormat: 'YYYY-MM-DD', useUtc: options.useUtc })
    }

    if (dataType === 'string' || dataType === 'stringSimple') {
      formattedRowValue = textFnc(formattedRowValue ?? '') || undefined
      formattedValue = textFnc(formattedValue ?? '') || undefined
    }

    switch (comparator) {
      case ComparatorEnum.STARTS_WITH:
        valid =
          valid && textFnc((formattedRowValue || '').toString()).startsWith(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.NOT_STARTS_WITH:
        valid =
          valid && !textFnc((formattedRowValue || '').toString()).startsWith(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.ENDS_WITH:
        valid =
          valid && textFnc((formattedRowValue || '').toString()).endsWith(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.NOT_ENDS_WITH:
        valid =
          valid && !textFnc((formattedRowValue || '').toString()).endsWith(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.GREATER_THAN:
        valid = valid && formattedRowValue > formattedValue
        break

      case ComparatorEnum.LESS_THAN:
        valid = valid && formattedRowValue < formattedValue
        break

      case ComparatorEnum.GREATER_THAN_OR_EQUAL:
        valid = valid && formattedRowValue >= formattedValue
        break

      case ComparatorEnum.LESS_THAN_OR_EQUAL:
        valid = valid && formattedRowValue <= formattedValue
        break

      case ComparatorEnum.EQUAL:
        if (dataType && dateTypes.includes(dataType)) {
          return $date(rowValue, { utc: options.useUtc }).isSame($date(value, { utc: options.useUtc }), 'day')
        } else {
          valid = valid && formattedRowValue === formattedValue
        }

        break

      case ComparatorEnum.NOT_EQUAL:
        if (dataType && dateTypes.includes(dataType)) {
          return !$date(rowValue, { utc: options.useUtc }).isSame($date(value, { utc: options.useUtc }), 'day')
        } else {
          valid = valid && formattedRowValue !== formattedValue
        }

        break

      case ComparatorEnum.IS_EMPTY:
        valid = valid && (Array.isArray(formattedRowValue) ? !formattedRowValue.length : isNil(formattedRowValue))
        break

      case ComparatorEnum.NOT_IS_EMPTY:
        valid = valid && (Array.isArray(formattedRowValue) ? !!formattedRowValue.length : !isNil(formattedRowValue))
        break

      case ComparatorEnum.CONTAINS:
        valid =
          valid && textFnc((formattedRowValue || '').toString()).includes(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.NOT_CONTAINS:
        valid =
          valid && !textFnc((formattedRowValue || '').toString()).includes(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.IN:
        valid =
          valid && textFnc((formattedRowValue || '').toString()).includes(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.IN_EVERY:
        valid =
          valid &&
          Array.isArray(formattedRowValue) &&
          Array.isArray(formattedValue) &&
          formattedValue.length === formattedRowValue.length &&
          formattedValue.every((val) => formattedRowValue.includes(val)) &&
          formattedRowValue.every((val) => formattedValue.includes(val))

        break

      case ComparatorEnum.NOT_IN:
      case ComparatorEnum.IN_NONE:
        valid =
          valid && !textFnc((formattedRowValue || '').toString()).includes(textFnc((formattedValue || '').toString()))
        break

      case ComparatorEnum.IS:
        valid = valid && formattedRowValue === formattedValue
        break

      case ComparatorEnum.NOT_IS:
        valid = valid && formattedRowValue !== formattedValue
        break

      default:
        valid = valid && formattedRowValue === formattedValue
        break
    }

    return valid
  }

  function filterData<T extends IItem = IItem>(
    dataRef: MaybeRefOrGetter<T[]>,
    filtersRef: MaybeRefOrGetter<IFilter<T>[]>,
    rowKey = 'id',

    options?: {
      runAll?: boolean
      onInvalid?: (filter: any, row: T) => void
    },
  ) {
    const data = toValue(dataRef)
    const filters = toValue(filtersRef)

    const dateTypes = getDateTypes(getUtilitiesConfig().dataTypeExtend.dateTimeDataTypes)

    return filterDataCoreFn(data, filters, rowKey, {
      ...options,
      transliterate: getUtilitiesConfig().public.transliterate,
      useUtc: getUtilitiesConfig().public.useUtc,
      dateTypes,
    })
  }

  function handleFilterWithConfig(...args: Parameters<typeof handleFilter>) {
    const [comparator, rowValue, value, dataType, options] = args

    const dateTypes = getDateTypes(getUtilitiesConfig().dataTypeExtend.dateTimeDataTypes)

    return handleFilter(comparator, rowValue, value, dataType, {
      ...options,
      transliterate: getUtilitiesConfig().public.transliterate,
      useUtc: getUtilitiesConfig().public.useUtc,
      dateTypes,
    })
  }

  return {
    filterData,
    handleFilter: handleFilterWithConfig,
  }
}
