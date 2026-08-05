import { defineTask } from 'nitro/task'
import { runZakazkyGovCrawl } from 'crawlers'
import { nitroCrawlStore } from '../crawlers/db'

export default defineTask({
  meta: {
    name: 'crawl-zakazky-gov',
    description: 'Crawl active tenders from Zakázky GOV',
  },
  async run() {
    const result = await runZakazkyGovCrawl(nitroCrawlStore)
    return { result: result.status, ...result }
  },
})
