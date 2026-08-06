// Types
import type { IItem } from '../types/item.type'
import type { ExtendedDataType } from '../enums/data-type'
import type { IFormatValueOptions } from '../types/format-value-options.type'
import type { PredictDataTypeOptions } from '../types/predict-data-type-options.type'

// Models
import type { FileModel } from '../models/file.model'
import type { ComparatorEnum } from '../enums/comparator.enum'

/** Loose fn-payload shape so core config does not depend on vue/. */
type FnPayloadLoose = Record<string, any>

type IComponent = {
  component: string
  props?: IItem
  icon?: string
}

type IFormatFnc = (
  value: any,
  row?: any,
  formatOptions?: IFormatValueOptions & {
    formatFnc?: (value: any, row?: any, options?: IFormatValueOptions) => any
    defaultHandler: () => any
  },
) => any

type IParseFnc = (payload: {
  value: any
  dataType?: ExtendedDataType
  options?: {
    dateFormat?: string
    timezone?: string
    comparator?: ComparatorEnum
    predictDataType?: PredictDataTypeOptions
    additionalData?: any
  }
  defaultHandler?: () => any
}) => any

export type TranslateFn = (
  key: string,
  pluralOrNamed?: string | number | Record<string, unknown>,
  options?: Record<string, unknown>,
) => string

export type IUtilitiesConfig = {
  dataTypeExtend: {
    comparatorsByDataType?: Partial<Record<ExtendedDataType, ComparatorEnum[]>>
    defaultComparatorByDataType?: Partial<Record<ExtendedDataType, ComparatorEnum>>
    inputByDataType?: Partial<Record<ExtendedDataType, IComponent | undefined>>
    formatFncByDataType?: Partial<Record<ExtendedDataType, IFormatFnc>>
    parseFncByDataType?: Partial<Record<ExtendedDataType, IParseFnc>>

    selectorComparators?: ComparatorEnum[]
    nonValueComparators?: ComparatorEnum[]
    booleanishComparators?: ComparatorEnum[]

    numberDataTypes?: ExtendedDataType[]
    dateTimeDataTypes?: ExtendedDataType[]
  }

  logging: {
    limit?: number
  }

  files: {
    uploadHandler?: (payload: {
      file: FileModel
      requestHandler?: any
      additionalData?: IItem
      headers?: IItem
      onError?: (error: any) => void
      onComplete?: (res: any) => void
    }) => Promise<any> | any

    deleteHandler?: (payload: {
      file: FileModel
      requestHandler: any
      additionalData?: IItem
      onComplete?: (res: any) => void
      onError?: (error: any) => void
    }) => Promise<any> | any
  }

  request: {
    payloadKey?: string
    modifyFnc?: (obj: any) => any
    onComplete?: (payload: { response: any; result: any }) => void
    onError?: (payload: { error: any; response: any }) => Promise<any> | any
  }

  fn: {
    modifyResultFn?: (obj: any) => any
    onComplete?: (payload: { response: any; result: any; fnPayload: FnPayloadLoose }) => void
    onError?: (payload: { error: any; response: any; fnPayload: FnPayloadLoose }) => Promise<any> | any
  }

  public: {
    env?: string
    filesHost?: string
    transliterate?: boolean
    useUtc?: boolean
    domain?: string
  }

  translate?: TranslateFn
}
