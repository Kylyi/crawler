import process from 'node:process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const isCI = !!process.env.CI
const configDir = path.dirname(fileURLToPath(import.meta.url))
const vpBin = path.join(configDir, 'node_modules', '.bin', 'vp')
const wranglerBin = path.join(configDir, 'node_modules', '.bin', 'wrangler')
const port = isCI ? 4173 : 5173
const baseURL = `http://localhost:${port}`
/** Cloudflare build + local D1 — `vp preview` has no Workers bindings. */
const ciWebServer = [
  wranglerBin,
  'dev',
  '--config',
  '.output/server/wrangler.json',
  '--persist-to',
  '.wrangler/state',
  '--port',
  String(port),
  '--ip',
  '127.0.0.1',
  '--show-interactive-dev-session',
  'false',
].join(' ')

export default defineConfig({
  testDir: './e2e',
  outputDir: 'test-results',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI
    ? [['github'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/playwright-junit.xml' }]]
    : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Only on CI systems run the tests headless */
    headless: isCI,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer: {
    /**
     * Local: Vite+ dev (Nitro `devDatabase` sqlite).
     * CI: Wrangler + local D1 against the Cloudflare build (Workers bindings).
     * Playwright will re-use an existing local server when not in CI.
     */
    command: isCI ? ciWebServer : `${vpBin} dev --port ${port} --strictPort`,
    cwd: configDir,
    url: baseURL,
    reuseExistingServer: !isCI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
