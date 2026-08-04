import { defineConfig } from 'vite-plus'
import { eslintAlignedFmt, eslintAlignedLint } from '@crawler/eslint-config/oxlint'

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  fmt: eslintAlignedFmt,
  lint: {
    ...eslintAlignedLint,
    plugins: ['eslint', 'typescript', 'unicorn', 'oxc'],
  },
})
