// @ts-check
/** Shared ESLint config for Nuxt apps. */

import antfu from '@antfu/eslint-config'
import { createConfigForNuxt } from '@nuxt/eslint-config'

export default createConfigForNuxt({
  features: {
    standalone: false,
    stylistic: true,
  },
})
  .prepend(antfu({ formatters: true, gitignore: true }))
  .append({
    ignores: ['**/*.generated.*', '.nuxt/**', '.output/**', 'dist/**'],
  })
  .append({
    // Core `curly: all` (antfu/curly allows single-line bodies; overrideRules cannot add new rule keys).
    rules: {
      'antfu/curly': 'off',
      curly: ['warn', 'all'],
      // Require blank line before return statements for readability.
      // Using style/ prefix to match antfu's @stylistic plugin registration.
      'style/padding-line-between-statements': ['warn', { blankLine: 'always', prev: '*', next: 'return' }],
    },
  })
  .overrideRules({
    'vue/max-attributes-per-line': ['warn', { singleline: 1, multiline: { max: 1 } }],
    'ts/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
    'ts/consistent-type-definitions': ['warn', 'type'],
    'vue/max-len': ['warn', { code: 120, template: 120, ignorePattern: '^import .*' }],
    // 1tbs, multiline blocks: pairs with core `curly` --fix (which otherwise leaves awkward one-line bodies).
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
  })
