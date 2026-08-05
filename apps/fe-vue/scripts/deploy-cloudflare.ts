import type { Script } from '../../../scripts/_lib/types.ts'
import { confirmOrCancel } from '../../../scripts/_lib/prompt.ts'
import { run } from '../../../scripts/_lib/run.ts'

export default {
  id: 'deploy:cloudflare',
  label: 'Deploy to Cloudflare Workers',
  group: 'Deploy',
  async run(ctx) {
    if (!ctx.appDir) {
      throw new Error('Expected appDir for fe-vue script')
    }

    if (ctx.interactive) {
      const ok = await confirmOrCancel('Deploy to Cloudflare Workers?', true)
      if (!ok) {
        throw new Error('Cancelled.')
      }
    }

    await run('wrangler', ['deploy', '--config', '.output/server/wrangler.json'], {
      cwd: ctx.appDir,
    })
  },
} satisfies Script
