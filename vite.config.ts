import { defineConfig } from 'vite-plus'
import { eslintAlignedFmt, eslintAlignedLint } from '@crawler/eslint-config/oxlint'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: eslintAlignedFmt,
  lint: eslintAlignedLint,
  run: {
    // Script caching captures stdio and breaks interactive Clack prompts (e.g. `vp run scripts`).
    cache: {
      scripts: false,
      tasks: true,
    },
  },
})
