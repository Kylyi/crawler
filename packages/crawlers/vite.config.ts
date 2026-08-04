import { defineConfig } from 'vite-plus'
import { eslintAlignedFmt, eslintAlignedLint } from '@crawler/eslint-config/oxlint'

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  test: {
    include: ['src/**/*.spec.ts'],
  },
  fmt: eslintAlignedFmt,
  lint: {
    ...eslintAlignedLint,
    // Pure TS package — no Vue plugin needed
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc'],
  },
})
