import type { App, InjectionKey, Plugin } from 'vue'
import type { IUtilitiesConfig } from '../core/config/utilities-config.type'
import { setUtilitiesConfig, getUtilitiesConfig } from '../core/config/runtime-config'
import { customDefu } from '../core/config/custom-defu'
import { defaultUtilitiesConfig } from '../core/config/default-config'

export type CreateUtilitiesOptions = Partial<IUtilitiesConfig> & {
  /**
   * Optional vue-i18n-like translator. Wired into core via `config.translate`.
   */
  translate?: IUtilitiesConfig['translate']
}

export const utilitiesConfigKey: InjectionKey<IUtilitiesConfig> = Symbol('gentl-utilities-config')

export function createUtilities(options: CreateUtilitiesOptions = {}): Plugin {
  const plugin: Plugin = {
    install(app: App) {
      const { translate, ...rest } = options
      const config = customDefu(
        structuredClone(defaultUtilitiesConfig) as IUtilitiesConfig,
        rest,
        translate ? { translate } : {},
      ) as IUtilitiesConfig

      setUtilitiesConfig(config)
      app.provide(utilitiesConfigKey, getUtilitiesConfig())
    },
  }

  return plugin
}
