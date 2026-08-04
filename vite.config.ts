import { defineConfig } from 'vite-plus'
import { eslintAlignedFmt, eslintAlignedLint } from '@crawler/eslint-config/oxlint'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: eslintAlignedFmt,
  lint: eslintAlignedLint,
  run: {
    cache: true,
  },
})
