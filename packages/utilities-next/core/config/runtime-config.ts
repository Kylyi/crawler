import type { IUtilitiesConfig } from './utilities-config.type'
import { defaultUtilitiesConfig } from './default-config'
import { customDefu } from './custom-defu'

/**
 * Static-per-app utilities config. Set once at startup via
 * `setUtilitiesConfig` / `createUtilities` / the Nuxt bridge plugin.
 * Must not hold per-request state (SSR-safe as a process singleton).
 */
let utilitiesConfig: IUtilitiesConfig = structuredClone(defaultUtilitiesConfig) as IUtilitiesConfig

export function getUtilitiesConfig(): IUtilitiesConfig {
  return utilitiesConfig
}

export function setUtilitiesConfig(config: Partial<IUtilitiesConfig> | IUtilitiesConfig) {
  utilitiesConfig = customDefu(structuredClone(defaultUtilitiesConfig) as IUtilitiesConfig, config) as IUtilitiesConfig
  return utilitiesConfig
}

export function defineUtilitiesConfig<T extends Partial<IUtilitiesConfig>>(config: T): T {
  return config
}

export function mergeUtilitiesConfig(...configs: Array<Partial<IUtilitiesConfig> | IUtilitiesConfig>) {
  utilitiesConfig = customDefu(
    structuredClone(defaultUtilitiesConfig) as IUtilitiesConfig,
    ...configs,
  ) as IUtilitiesConfig
  return utilitiesConfig
}
