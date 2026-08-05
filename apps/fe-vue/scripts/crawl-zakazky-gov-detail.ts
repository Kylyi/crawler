import type { Script } from '../../../scripts/_lib/types.ts'
import { postCrawl, resolveBaseUrl, resolveLimit } from './_shared.ts'

export default {
  id: 'crawl:zakazky-gov:detail',
  label: 'Crawl zakazky-gov detail (batch)',
  group: 'Crawl',
  async run(ctx) {
    const base = await resolveBaseUrl(ctx)
    const limit = await resolveLimit(ctx, 50)
    await postCrawl(`${base}/api/crawl/zakazky-gov/detail?limit=${limit}`)
  },
} satisfies Script
