/**
 * Oxlint + Oxfmt settings aligned with `@crawler/eslint-config`.
 *
 * ESLint flat configs are the source of truth. Keep this file in sync when
 * changing rules in `eslint.config.mjs` / `vue.mjs` / `typescript.mjs`.
 *
 * Not every ESLint rule has an Oxlint equivalent — style that Oxfmt owns
 * (quotes, semis, width) lives under `eslintAlignedFmt`.
 */

/** @type {import('vite-plus').UserConfig['fmt']} */
export const eslintAlignedFmt = {
  semi: false,
  singleQuote: true,
  printWidth: 120,
}

/** @type {import('vite-plus').UserConfig['lint']} */
export const eslintAlignedLint = {
  plugins: ['eslint', 'typescript', 'unicorn', 'oxc', 'vue'],
  categories: {
    correctness: 'error',
  },
  ignorePatterns: [
    '**/dist/**',
    '**/dist-ssr/**',
    '**/.nuxt/**',
    '**/.output/**',
    '**/coverage/**',
    '**/*.generated.*',
  ],
  rules: {
    // --- mirrors packages/ESLint/*.mjs overrides ---
    'no-console': 'off',
    curly: ['warn', 'all'],
    'typescript/ban-ts-comment': 'off',
    'typescript/no-use-before-define': 'off',
    'typescript/no-unsafe-function-type': 'off',
    'typescript/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
    'typescript/consistent-type-definitions': ['warn', 'type'],
    'typescript/no-explicit-any': 'warn',
    'unicorn/consistent-function-scoping': 'off',
    'no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // Vite+ specific (no ESLint counterpart)
    'vite-plus/prefer-vite-plus-imports': 'error',
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
  jsPlugins: [
    {
      name: 'vite-plus',
      specifier: 'vite-plus/oxlint-plugin',
    },
  ],
}
