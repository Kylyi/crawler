import type { IUtilitiesConfig } from './utilities-config.type'
import type { IItem } from '../types/item.type'

export function extendUtilitiesConfig<T extends Partial<IUtilitiesConfig> & IItem>(config: T): T {
  return config
}
