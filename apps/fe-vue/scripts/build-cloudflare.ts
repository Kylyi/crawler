import type { Script } from '../../../scripts/_lib/types.ts'
import { run } from '../../../scripts/_lib/run.ts'

export default {
  id: 'build:cloudflare',
  label: 'Build for Cloudflare',
  group: 'Deploy',
  async run(ctx) {
    if (!ctx.appDir) {
      throw new Error('Expected appDir for fe-vue script')
    }

    await run('vp', ['build'], {
      cwd: ctx.appDir,
      env: { NITRO_PRESET: 'cloudflare_module' },
    })
  },
} satisfies Script
