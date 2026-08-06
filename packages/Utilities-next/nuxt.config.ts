import { createResolver } from 'nuxt/kit'
import { prepareLocalNuxtLayers } from './prepare-layers'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  modules: [
    resolve('./modules/utilities.module.ts'),
    resolve('./modules/lodash.module.ts'),
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/scripts',
  ],

  $meta: {
    name: 'utilities',
  },

  imports: {
    imports: [
      { name: 'z', from: 'zod' },
      { name: '$t', from: resolve('./app/utils/$t'), priority: 100 },
      { name: 'tMarker', from: resolve('./core/utils/t-marker') },
      { name: '$date', from: resolve('./core/utils/$date') },
      { name: 'generateUUID', from: resolve('./core/utils/generate-uuid') },
      { name: 'isDev', from: resolve('./core/utils/is-dev') },
      { name: 'formatValue', from: resolve('./vue/utils/format-value') },
      { name: 'parseValue', from: resolve('./core/utils/parse-value') },
      { name: 'getUtilitiesConfig', from: resolve('./core/config/runtime-config') },
      { name: 'extendUtilitiesConfig', from: resolve('./core/config/extend-utilities-config') },
    ],
    dirs: [
      resolve('./app/composables'),
      resolve('./app/utils'),
      resolve('./core/constants'),
      resolve('./core/enums'),
      resolve('./core/functions'),
      resolve('./core/models'),
      resolve('./core/types'),
      resolve('./core/regex'),
    ],
  },

  runtimeConfig: {
    public: {
      env: '',
      filesHost: '/api/files',
      transliterate: true,
      useUtc: false,
      domain: '',
    },
  },

  future: {
    compatibilityVersion: 5,
  },

  nitro: {
    imports: {
      dirsScanOptions: { fileFilter: () => false },

      imports: [
        { name: 'Datetime', from: resolve('./core/types/datetime.type'), type: true },
        { name: 'IItem', from: resolve('./core/types/item.type'), type: true },
        { name: 'ObjectKey', from: resolve('./core/types/object-key.type'), type: true },

        { name: 'z', from: 'zod' },
        { name: '$date', from: resolve('./core/utils/$date') },
        { name: 'tMarker', from: resolve('./core/utils/t-marker') },
        { name: '$t', from: resolve('./core/utils/t-marker') },
        { name: 'generateUUID', from: resolve('./core/utils/generate-uuid') },
        { name: 'isDev', from: resolve('./core/utils/is-dev') },
        { name: 'parseValue', from: resolve('./core/utils/parse-value') },

        { name: 'get', from: 'lodash-es' },
        { name: 'set', from: 'lodash-es' },
        { name: 'isNil', from: 'lodash-es' },
        { name: 'pick', from: 'lodash-es' },
        { name: 'omit', from: 'lodash-es' },
        { name: 'isEmpty', from: 'lodash-es' },
        { name: 'isEqual', from: 'lodash-es' },
      ],
    },
  },

  hooks: {
    ready: prepareLocalNuxtLayers,
  },

  i18n: {
    autoDeclare: false,
    langDir: '../i18n',
    defaultLocale: 'en-US',
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
    locales: [
      {
        code: 'en-US',
        file: 'en-US_utilities.json',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
        language: 'English',
        icon: 'i-emojione:flag-for-united-kingdom',
      },
      {
        code: 'cs-CZ',
        file: 'cs-CZ_utilities.json',
        dateFormat: 'DD.MM.YYYY',
        currency: 'CZK',
        language: 'Česky',
        icon: 'i-emojione:flag-for-czechia',
      },
    ],
  },
})
