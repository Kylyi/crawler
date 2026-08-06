import process from 'node:process'
import { defineHandler } from 'nitro'
import { runZakazkyGovCrawl } from 'crawlers'
import { nitroCrawlStore } from '../../crawlers/db'

export default defineHandler(async event => {
  const apiKey = process.env.CRAWL_API_KEY
  if (apiKey) {
    const provided = event.req.headers.get('x-crawl-api-key')
    if (provided !== apiKey) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  const result = await runZakazkyGovCrawl(nitroCrawlStore)

  return {
    ok: result.status === 'success',
    ...result,
  }
})
