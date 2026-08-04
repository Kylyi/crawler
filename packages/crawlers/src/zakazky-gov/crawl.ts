import { createCrawlLogger } from '../logger'
import type { CrawlStore } from '../store'
import type { CrawlResult } from '../types'
import { fetchAllPages } from './client'
import { resolveConfig, SOURCE_SLUG } from './config'
import { mapListResponseToTenders } from './mapper'

const log = createCrawlLogger('zakazky-gov')

export async function runZakazkyGovCrawl(store: CrawlStore): Promise<CrawlResult> {
  const startedAt = Date.now()
  const source = await store.getSourceBySlug(SOURCE_SLUG)
  const config = resolveConfig(source)
  const runId = await store.startCrawlRun(SOURCE_SLUG)

  log.start('list crawl', {
    runId,
    skupinaZakazek: config.skupinaZakazek,
    pageSize: config.pageSize,
    maxPages: config.maxPages,
  })

  let tendersFound = 0
  let pagesFetched = 0

  try {
    const pages = await fetchAllPages(config, ({ page, items }, totals) => {
      log.progress('fetched list page', {
        page,
        pageItems: items.polozky.length,
        totalPages: totals.pages,
        totalItems: totals.items,
        lastPage: items.posledni_stranka,
      })
    })
    pagesFetched = pages.length

    log.info('upserting tenders', { pages: pagesFetched })

    for (const { page, items } of pages) {
      const tenders = mapListResponseToTenders(items.polozky, config.portalBaseUrl)

      for (const tender of tenders) {
        await store.upsertTender(SOURCE_SLUG, tender)
        tendersFound++
      }

      log.progress('stored list page', {
        page,
        pageTenders: tenders.length,
        totalTenders: tendersFound,
      })
    }

    const durationMs = Date.now() - startedAt

    await store.finishCrawlRun(runId, {
      status: 'success',
      tendersFound,
    })

    log.finish('list crawl succeeded', {
      runId,
      tendersFound,
      pagesFetched,
      durationMs,
    })

    return {
      runId,
      source: SOURCE_SLUG,
      tendersFound,
      pagesFetched,
      durationMs,
      status: 'success',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const durationMs = Date.now() - startedAt

    await store.finishCrawlRun(runId, {
      status: 'failed',
      tendersFound,
      errorMessage: message,
    })

    log.error('list crawl failed', {
      runId,
      tendersFound,
      pagesFetched,
      durationMs,
      error: message,
    })

    return {
      runId,
      source: SOURCE_SLUG,
      tendersFound,
      pagesFetched,
      durationMs,
      status: 'failed',
      error: message,
    }
  }
}
