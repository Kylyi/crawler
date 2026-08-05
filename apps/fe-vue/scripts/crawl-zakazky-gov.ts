import type { Script } from '../../../scripts/_lib/types.ts'
import { postCrawl, resolveBaseUrl } from './_shared.ts'

export default {
  id: 'crawl:zakazky-gov',
  label: 'Crawl zakazky-gov (list)',
  group: 'Crawl',
  async run(ctx) {
    const base = await resolveBaseUrl(ctx)
    await postCrawl(`${base}/api/crawl/zakazky-gov`)
  },
} satisfies Script
