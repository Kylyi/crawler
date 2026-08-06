import { getUtilitiesConfig } from '../core/config/runtime-config'

/**
 * Client-side translator backed by `createUtilities({ translate })` /
 * Nuxt bridge `config.translate`.
 */
export function $t(
  key: string,
  pluralOrNamed?: string | number | Record<string, unknown>,
  options?: Record<string, unknown>,
): string {
  const translate = getUtilitiesConfig().translate
  if (!translate) {
    return key
  }

  return translate(key, pluralOrNamed, options)
}
