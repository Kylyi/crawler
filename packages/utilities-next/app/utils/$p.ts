import type { Locale } from '#i18n'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Returns localized path
 */
export function $p(route: RouteLocationRaw, locale?: Locale  ) {
  const localePath = useLocalePath()

  return localePath(route as any, locale || undefined)
}
