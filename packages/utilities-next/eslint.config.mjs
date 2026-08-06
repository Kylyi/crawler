/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['_legacy_*/**', '.nuxt/**', 'node_modules/**'],
  },
  {
    files: ['core/**/*.{ts,js}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'vue', message: 'core/ must not import vue' },
            { name: 'nuxt', message: 'core/ must not import nuxt' },
            { name: '#imports', message: 'core/ must not use Nuxt aliases' },
            { name: '#app', message: 'core/ must not use Nuxt aliases' },
            { name: '#i18n', message: 'core/ must not use Nuxt aliases' },
          ],
          patterns: [
            { group: ['nuxt/*', '@nuxt/*', '#*'], message: 'core/ must not import Nuxt' },
            {
              group: ['vue-router', 'vue-i18n', '@vueuse/*'],
              message: 'core/ must stay framework-agnostic',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['vue/**/*.{ts,js}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'nuxt', message: 'vue/ must not import nuxt' }],
          patterns: [
            { group: ['nuxt/*', '@nuxt/*', '#*'], message: 'vue/ must not import Nuxt' },
          ],
        },
      ],
    },
  },
]
