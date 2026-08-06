import { setUtilitiesConfig } from '../../core/config/runtime-config'
import { customDefu } from '../../core/config/custom-defu'
import layerConfig from '../config'

/**
 * Bridges Nuxt runtimeConfig + layer config into the core singleton,
 * and wires `$i18n.t` as `config.translate`.
 */
export default defineNuxtPlugin(() => {
  const rC = useRuntimeConfig()
  const { $i18n } = useNuxtApp()

  const translate = (
    key: string,
    pluralOrNamed?: string | number | Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => {
    const { t, locale } = $i18n
    const _options = options ?? { locale: locale.value }

    return pluralOrNamed !== undefined ? t(key, pluralOrNamed as any, _options as any) : t(key, _options as any)
  }

  setUtilitiesConfig(
    customDefu(layerConfig, {
      public: {
        env: rC.public.env as string,
        filesHost: rC.public.filesHost as string,
        transliterate: rC.public.transliterate as boolean,
        useUtc: rC.public.useUtc as boolean,
        domain: rC.public.domain as string,
      },
      translate,
    }),
  )
})
