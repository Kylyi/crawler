import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

function spliced<T>(array: T[], start: number, deleteCount: number, ...items: T[]): T[] {
  return [...array.slice(0, start), ...items, ...array.slice(start + deleteCount)]
}

export function moveItem<T>(arrayRef: MaybeRefOrGetter<T[]>, fromIndex: number, toIndex: number): T[] {
  const array = toValue(arrayRef)

  if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex > array.length) {
    throw new Error('Index out of bounds')
  }

  const item = array[fromIndex] as T
  const newArray = spliced(array, fromIndex, 1)
  return spliced(newArray, toIndex, 0, item)
}
