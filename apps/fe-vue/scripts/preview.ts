import type { Script } from '../../../scripts/_lib/types.ts'
import { run } from '../../../scripts/_lib/run.ts'

export default {
  id: 'preview',
  label: 'Preview production build',
  group: 'Dev',
  async run(ctx) {
    if (!ctx.appDir) {
      throw new Error('Expected appDir for fe-vue script')
    }

    await run('vp', ['preview'], { cwd: ctx.appDir })
  },
} satisfies Script
