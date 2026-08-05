import type { Script } from '../../../scripts/_lib/types.ts'
import { run } from '../../../scripts/_lib/run.ts'

export default {
  id: 'db:migrations:list',
  label: 'List D1 migrations (local)',
  group: 'DB',
  async run(ctx) {
    if (!ctx.appDir) {
      throw new Error('Expected appDir for fe-vue script')
    }

    await run('wrangler', ['d1', 'migrations', 'list', 'fe-vue-db', '--local'], {
      cwd: ctx.appDir,
    })
  },
} satisfies Script
