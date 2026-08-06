import { fileURLToPath, URL } from 'node:url'

import { defineConfig, lazyPlugins } from 'vite-plus'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { nitro } from 'nitro/vite'

// https://vite.dev/config/
export default defineConfig({
  check: {
    lint: false,
    fmt: false,
  },
  plugins: lazyPlugins(() => [vue(), vueDevTools(), nitro()]),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
