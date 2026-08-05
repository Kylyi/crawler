import { FetchError, ofetch } from 'ofetch'
import { createCrawlLogger } from '../logger'
import { sleep } from '../utils'
import type { ZakazkyGovConfig, ZakazkyGovDetailResponse } from './types'

const USER_AGENT = 'Crawler/fe-vue (+https://zakazky.gov.cz)'
const RATE_LIMIT_BACKOFF_MS = [5_000, 15_000, 30_000, 60_000, 90_000]
const log = createCrawlLogger('zakazky-gov:detail')

export async function fetchDetail(rvzId: string, config: ZakazkyGovConfig): Promise<ZakazkyGovDetailResponse | null> {
  const url = `${config.detailApiUrl.replace(/\/$/, '')}/${rvzId}`

  for (let attempt = 0; attempt <= RATE_LIMIT_BACKOFF_MS.length; attempt++) {
    try {
      return await ofetch<ZakazkyGovDetailResponse>(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': USER_AGENT,
        },
      })
    } catch (error) {
      if (error instanceof FetchError && error.response?.status === 404) {
        return null
      }

      if (error instanceof FetchError && error.response?.status === 429 && attempt < RATE_LIMIT_BACKOFF_MS.length) {
        const backoffMs = RATE_LIMIT_BACKOFF_MS[attempt]!
        log.warn('API rate limited, backing off', {
          externalId: rvzId,
          attempt: attempt + 1,
          maxAttempts: RATE_LIMIT_BACKOFF_MS.length,
          backoffMs,
        })
        await sleep(backoffMs)
        continue
      }

      throw error
    }
  }

  return null
}
