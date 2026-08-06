
export const DataTypeValues = [
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

export type DataType = (typeof DataTypeValues)[number]
type SimpleDataType = `${DataType}Simple`
export type ExtendedDataType = DataType | SimpleDataType
