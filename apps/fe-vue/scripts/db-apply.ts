import type { Script } from '../../../scripts/_lib/types.ts'
import { selectOrCancel } from '../../../scripts/_lib/prompt.ts'
import { flagString, parseFlags, run } from '../../../scripts/_lib/run.ts'

export default {
  id: 'db:apply',
  label: 'Apply D1 migrations',
  group: 'DB',
  async run(ctx) {
    if (!ctx.appDir) {
      throw new Error('Expected appDir for fe-vue script')
    }

    const flags = parseFlags(ctx.argv)
    let target = flagString(flags, 'target')

    if (!target && ctx.interactive) {
      target =
        (await selectOrCancel('Target', [
          { label: 'Local', value: 'local' },
          { label: 'Remote', value: 'remote' },
        ])) ?? undefined
    }

    if (target !== 'local' && target !== 'remote') {
      throw new Error('Missing target. Pass --target=local|remote')
    }

    await run('wrangler', ['d1', 'migrations', 'apply', 'fe-vue-db', `--${target}`], {
      cwd: ctx.appDir,
    })
  },
} satisfies Script
