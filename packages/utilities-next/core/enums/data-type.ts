/**
 * Base data types as a const object + string unions (structural / mergeable).
 * Nuxt apps may extend these via layer config merge.
 */
export const DataTypeValues = [
  // String
  'string',

  // Number
  'number',
  'percent',
  'decimal',

  // Currency
  'currency',

  // Duration
  'duration',

  // Date
  'date',
  'datetime',
  'yearMonth',
  'timestamp',
  'fullDateTime',

  // Boolean
  'boolean',
  'bool',

  // Custom
  'time',
  'custom',
] as const

export type DataType = (typeof DataTypeValues)[number]

export type SimpleDataType = `${DataType}Simple`

export type ExtendedDataType = DataType | SimpleDataType
