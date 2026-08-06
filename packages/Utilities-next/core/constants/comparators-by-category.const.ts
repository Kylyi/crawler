import { uniq } from 'lodash-es'
import { getUtilitiesConfig } from '../config/runtime-config'
import { ComparatorEnum } from '../enums/comparator.enum'

const NON_VALUE_COMPARATORS = [ComparatorEnum.IS_EMPTY, ComparatorEnum.NOT_IS_EMPTY]

const BOOLEANISH_COMPARATORS = [ComparatorEnum.IS, ComparatorEnum.NOT_IS]

const SELECTOR_COMPARATORS = [ComparatorEnum.IN, ComparatorEnum.NOT_IN]

export function getNonValueComparators(extraComparators: ComparatorEnum[] = []) {
  return uniq([
    ...NON_VALUE_COMPARATORS,
    ...(getUtilitiesConfig().dataTypeExtend.nonValueComparators ?? []),
    ...extraComparators,
  ])
}

export function getBooleanishComparators(extraComparators: ComparatorEnum[] = []) {
  return uniq([
    ...BOOLEANISH_COMPARATORS,
    ...(getUtilitiesConfig().dataTypeExtend.booleanishComparators ?? []),
    ...extraComparators,
  ])
}

export function getSelectorComparators(extraComparators: ComparatorEnum[] = []) {
  return uniq([
    ...SELECTOR_COMPARATORS,
    ...(getUtilitiesConfig().dataTypeExtend.selectorComparators ?? []),
    ...extraComparators,
  ])
}
