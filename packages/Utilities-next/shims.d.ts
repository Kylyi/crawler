type ImportMetaEnv = {
  readonly VITE_MONOREPO?: string
  readonly NUXT_PUBLIC_ENV?: string
  readonly NUXT_PUBLIC_FILES_HOST?: string
  readonly NUXT_PUBLIC_USE_UTC?: string
  readonly NUXT_PUBLIC_TRANSLITERATE?: string
  readonly NUXT_PUBLIC_DOMAIN?: string
  readonly NUXT_PUBLIC_THEME?: string
}

type ImportMeta = {
  readonly env: ImportMetaEnv
  readonly dev: boolean
  readonly client: boolean
  readonly server: boolean
}
