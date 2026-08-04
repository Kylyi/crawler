// @ts-check
/** Shared ESLint config for pure TypeScript packages. */

import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  typescript: true,
})
  .append({
    ignores: ['**/*.generated.*', 'dist/**'],
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
    'ts/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
    'ts/consistent-type-definitions': ['warn', 'type'],
    curly: ['warn', 'all'],
    '@stylistic/brace-style': 'off',
    'style/brace-style': 'off',
    'no-console': 'off',
    'node/prefer-global/process': ['warn', 'always'],
    'ts/no-use-before-define': 'off',
    'ts/ban-types': 'off',
    'unused-imports/no-unused-imports': 'off',
    'unused-imports/no-unused-imports-ts': 'off',
    'unused-imports/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'ts/ban-ts-comment': 'off',

    '@stylistic/arrow-parens': ['warn', 'as-needed'],
    'style/arrow-parens': ['warn', 'as-needed'],

    'style/quotes': ['warn', 'single', { avoidEscape: true }],
    '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
    'perfectionist/sort-imports': ['off'],
    'unicorn/consistent-function-scoping': 'off',
    'perfectionist/sort-objects': 'off',
    'ts/no-unsafe-function-type': 'off',
  })
