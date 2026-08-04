import { defineTask } from 'nitro/task'
import { runZakazkyGovDetailCrawl } from 'crawlers'
import { nitroCrawlStore } from '../crawlers/db'

export default defineTask({
  meta: {
    name: 'crawl-zakazky-gov-detail',
    description: 'Fetch tender details from Zakázky GOV detail API',
  },
  async run() {
    const result = await runZakazkyGovDetailCrawl(nitroCrawlStore)
    console.info('[crawl:zakazky-gov:detail]', JSON.stringify(result))
    return { result: result.status, ...result }
  },
})
