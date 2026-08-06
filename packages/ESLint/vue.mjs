// @ts-check
/** Shared ESLint config for Vue (non-Nuxt) apps. */

import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  typescript: true,
  vue: true,
})
  .append({
    ignores: ['**/*.generated.*', 'dist/**', 'dist-ssr/**', 'coverage/**', '.output/**'],
  })
  .append({
    rules: {
      'antfu/curly': 'off',
      'curly': ['warn', 'all'],
      'style/padding-line-between-statements': ['warn', { blankLine: 'always', prev: '*', next: 'return' }],
    },
  })
  .overrideRules({
    'vue/max-attributes-per-line': ['warn', { singleline: 1, multiline: { max: 1 } }],
    'vue/max-len': ['warn', { code: 120, template: 120, ignorePattern: '^import .*' }],
    '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: false }],
    'style/brace-style': ['warn', '1tbs', { allowSingleLine: false }],
    'vue/brace-style': ['warn', '1tbs', { allowSingleLine: false }],
    'no-console': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-text-v-html-on-component': 'warn',
    'ts/no-use-before-define': 'off',
    'ts/ban-types': 'off',
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-imports-ts': 'off',
    'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'ts/ban-ts-comment': 'off',

    '@stylistic/arrow-parens': ['warn', 'as-needed'],
    'style/arrow-parens': ['warn', 'as-needed'],
    'vue/custom-event-name-casing': 'off',

    'style/quotes': ['warn', 'single', { avoidEscape: true }],
    '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
    'perfectionist/sort-imports': ['off'],
    'unicorn/consistent-function-scoping': 'off',
    'perfectionist/sort-objects': 'off',
    'ts/no-unsafe-function-type': 'off',

    // Apps intentionally fork Nuxt/Vue/@types/node across named catalogs.
    'pnpm/yaml-no-duplicate-catalog-item': ['error', { checkDuplicates: 'exact-version' }],
  })
  // Do not put this in overrideRules — that re-enables it on markdown fences and crashes.
  .append({
    files: ['**/*.{ts,tsx,mts,cts,vue}'],
    rules: {
      'ts/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
      'ts/consistent-type-definitions': ['warn', 'type'],
    },
  })
