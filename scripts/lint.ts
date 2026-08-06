import type { Script } from './_lib/types.ts'
import { confirmOrCancel } from './_lib/prompt.ts'
import { parseFlags, run } from './_lib/run.ts'

export default {
  id: 'lint',
  label: 'Lint',
  group: 'Quality',
  hint: 'ESLint across the monorepo. Pass --fix (or confirm in the menu) to autofix.',
  async run(ctx) {
    const flags = parseFlags(ctx.argv)
    let fix = flags.fix === true

    if (!fix && ctx.interactive) {
      const confirmed = await confirmOrCancel('Apply autofixes (--fix)?', false)
      if (confirmed === null) {
        throw new Error('Cancelled.')
      }
      fix = confirmed
    }

    await run('vp', ['run', '-r', fix ? 'lint:fix' : 'lint'])
  },
} satisfies Script
