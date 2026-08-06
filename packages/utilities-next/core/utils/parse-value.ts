import type { ExtendedDataType } from '../enums/data-type'
import type { PredictDataTypeOptions } from '../types/predict-data-type-options.type'
import { getUtilitiesConfig } from '../config/runtime-config'

// Functions
import { predictDataType } from '../functions/predict-data-type'
import { isNil } from 'lodash-es'
import { $date } from './$date'

function handleParseValue(payload: {
  value: any
  dataType?: ExtendedDataType
  options?: {
    dateFormat?: string
    timezone?: string
    predictDataType?: PredictDataTypeOptions
    useUtc?: boolean
  }
}) {
  let { value, dataType, options } = payload
  const { dateFormat, predictDataType: _predictDataType, timezone, useUtc } = options || {}

  if (!dataType && _predictDataType) {
    const predictedDataType = predictDataType(_predictDataType)

    dataType = predictedDataType
  }

  dataType = dataType?.replace(/Simple$/, '') as ExtendedDataType

  switch (dataType) {
    case 'number':
    case 'percent':
      return Number(value)

    case 'date':
    case 'datetime':
    case 'timestamp':
    case 'yearMonth':
      return dateFormat
        ? timezone
          ? $date(value, { utc: useUtc }).tz(timezone).format(dateFormat)
          : $date(value, { utc: useUtc }).format(dateFormat)
        : $date(value, { utc: useUtc })

    case 'boolean':
      if (typeof value === 'boolean') {
        return value
      } else if (value === 'true') {
        return true
      } else if (value === 'false') {
        return false
      } else if (value === 'null') {
        return null
      }

      return

    case 'string':
    case 'time':
    default:
      return value
  }
}

export function parseValue(
  value: any,
  dataType?: ExtendedDataType,
  options?: {
    dateFormat?: string
    timezone?: string
    predictDataType?: PredictDataTypeOptions
    useUtc?: boolean
    additionalData?: any
    parseFncByDataType?: Partial<
      Record<
        ExtendedDataType,
        (payload: { value: any; dataType?: ExtendedDataType; options?: any; defaultHandler?: () => any }) => any
      >
    >
  },
) {
  options ??= {}
  options.parseFncByDataType ??= getUtilitiesConfig().dataTypeExtend.parseFncByDataType
  options.useUtc ??= getUtilitiesConfig().public.useUtc

  if (isNil(value)) {
    return value
  }

  const parseFncByDataType = options.parseFncByDataType ?? {}
  const _dataType = dataType as keyof typeof parseFncByDataType
  const customParseFnc = dataType && parseFncByDataType[_dataType]

  if (customParseFnc) {
    return customParseFnc({
      value,
      dataType,
      options,
      defaultHandler: () => handleParseValue({ value, dataType, options }),
    })
  }

  return handleParseValue({ value, dataType, options })
}
