import type { Script } from '../../../scripts/_lib/types.ts'
import { run } from '../../../scripts/_lib/run.ts'

export default {
  id: 'test:e2e',
  label: 'Run Playwright e2e tests',
  group: 'Test',
  async run(ctx) {
    if (!ctx.appDir) {
      throw new Error('Expected appDir for fe-vue script')
    }

    await run('playwright', ['test'], { cwd: ctx.appDir })
  },
} satisfies Script
