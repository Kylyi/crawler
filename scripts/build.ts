import type { Script } from './_lib/types.ts'
import { run } from './_lib/run.ts'

export default {
  id: 'build',
  label: 'Build',
  group: 'Build',
  hint: 'Build all workspace packages (vp run -r build)',
  async run() {
    await run('vp', ['run', '-r', 'build'])
  },
} satisfies Script
