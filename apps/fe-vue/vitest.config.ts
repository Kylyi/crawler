import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vite-plus'
import viteConfig from './vite.config'

const isCI = !!process.env.CI

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      reporters: isCI ? ['default', ['junit', { outputFile: 'test-results/vitest-junit.xml' }]] : ['default'],
    },
  }),
)
