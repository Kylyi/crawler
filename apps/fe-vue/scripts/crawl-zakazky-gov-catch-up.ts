import type { Script } from '../../../scripts/_lib/types.ts'
import { postCrawl, resolveBaseUrl, resolveLimit } from './_shared.ts'

export default {
  id: 'crawl:zakazky-gov:catch-up',
  label: 'Crawl zakazky-gov catch-up',
  group: 'Crawl',
  async run(ctx) {
    const base = await resolveBaseUrl(ctx)
    const limit = await resolveLimit(ctx, 50)
    await postCrawl(`${base}/api/crawl/zakazky-gov/catch-up?limit=${limit}`)
  },
} satisfies Script
