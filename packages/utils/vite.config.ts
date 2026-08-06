import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    // Use the workspace `typescript` (TNB). `dts.tsgo` needs `@typescript/native-preview`.
    dts: true,
    exports: true,
  },
  check: {
    lint: false,
    fmt: false,
  },
})
