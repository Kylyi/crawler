import { klona } from 'klona/full'
import { toValue } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

function spliced<T>(array: T[], start: number, deleteCount: number, ...items: T[]): T[] {
  return [...array.slice(0, start), ...items, ...array.slice(start + deleteCount)]
}

export function moveItems<T = any>(payload: { arrayRef: Ref<T[]>; toMoveRef: MaybeRefOrGetter<T[]>; toIndex: number }) {
  const { arrayRef, toIndex, toMoveRef } = payload
  let items = klona(toValue(arrayRef))
  const toMove = toValue(toMoveRef)

  const splicedItems: T[] = []
  toMove.forEach((item) => {
    // @ts-expect-error id may not exist on T
    const currentIndex = items.findIndex((_item) => _item.id === item.id)

    const splicedItem = items[currentIndex] as T
    items = spliced(items, currentIndex, 1, { _moved: true } as any)
    splicedItems.push(splicedItem)
  })

  items = spliced(items, toIndex, 0, ...splicedItems)

  return items.filter((item) => !(item as any)._moved)
}
