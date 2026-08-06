import { createSharedComposable, useActiveElement } from '@vueuse/core'
export const useSharedActiveElement = createSharedComposable(useActiveElement)
