import { getUtilitiesConfig } from '../config/runtime-config'

export function isDev() {
  // Prefer explicit config; fall back to Vite/Nuxt import.meta.dev when present.
  const metaDev = Boolean((import.meta as ImportMeta & { dev?: boolean }).dev)
  if (metaDev) {
    return true
  }

  const env = getUtilitiesConfig().public.env

  if (env === 'local' || env === 'development') {
    return true
  }

  return false
}
