import type { Locale } from '#i18n'
import type { RouteLocationRaw } from 'vue-router'

// Types
import type { NavigateToOptions } from '../../core/types/navigate-to.type'

/**
 * Navigate to localized path
 */
export function $nav(route: RouteLocationRaw, locale?: Locale  , options?: NavigateToOptions) {
  const localePath = useLocalePath()

  return navigateTo(localePath(route as any, locale), options)
}
