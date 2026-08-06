import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*.{js,cjs,mjs,ts,cts,mts,tsx,vue,json,jsonc,yml,yaml,md,html,css}': 'eslint --fix',
  },
  // Oxlint/Oxfmt disabled — ESLint handles lint + format (eslint-plugin-format).
  check: {
    lint: false,
    fmt: false,
  },
  run: {
    // Script caching captures stdio and breaks interactive Clack prompts (e.g. `vp run scripts`).
    cache: {
      scripts: false,
      tasks: true,
    },
  },
})
