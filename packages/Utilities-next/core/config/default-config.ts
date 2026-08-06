import type { ExtendedDataType } from '../enums/data-type'
import type { ComparatorEnum } from '../enums/comparator.enum'
import type { IUtilitiesConfig } from './utilities-config.type'

export const defaultUtilitiesConfig = {
  dataTypeExtend: {
    comparatorsByDataType: {} as Partial<Record<ExtendedDataType, ComparatorEnum[]>>,
    inputByDataType: {} as NonNullable<IUtilitiesConfig['dataTypeExtend']['inputByDataType']>,
    defaultComparatorByDataType: {} as Partial<Record<ExtendedDataType, ComparatorEnum>>,
    selectorComparators: [] as ComparatorEnum[],
    nonValueComparators: [] as ComparatorEnum[],
    booleanishComparators: [] as ComparatorEnum[],
    formatFncByDataType: {} as NonNullable<IUtilitiesConfig['dataTypeExtend']['formatFncByDataType']>,
    parseFncByDataType: {} as NonNullable<IUtilitiesConfig['dataTypeExtend']['parseFncByDataType']>,
    numberDataTypes: ['number', 'numberSimple'] as ExtendedDataType[],
    dateTimeDataTypes: ['date', 'datetime', 'yearMonth', 'timestamp', 'fullDateTime'] as ExtendedDataType[],
  },

  logging: {
    limit: 100,
  },

  request: {
    payloadKey: undefined,
    modifyFnc: undefined,
    onComplete: undefined,
    onError: undefined,
  },

  fn: {
    modifyResultFn: undefined,
    onComplete: undefined,
    onError: undefined,
  },

  files: {},

  /**
   * Runtime public options previously read from Nuxt `runtimeConfig.public`.
   */
  public: {
    env: '',
    filesHost: '/api/files',
    transliterate: true,
    useUtc: false,
    domain: '',
  },

  /**
   * Optional translator used by core helpers that need i18n.
   * Vue / Nuxt layers inject this.
   */
  translate: undefined as IUtilitiesConfig['translate'],
} satisfies IUtilitiesConfig
