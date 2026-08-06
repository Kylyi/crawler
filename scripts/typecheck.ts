import type { Script } from './_lib/types.ts'
import { run } from './_lib/run.ts'

export default {
  id: 'typecheck',
  label: 'Typecheck',
  group: 'Quality',
  hint: 'Typecheck all workspace packages (vp run -r typecheck)',
  async run() {
    await run('vp', ['run', '-r', 'typecheck'])
  },
} satisfies Script
