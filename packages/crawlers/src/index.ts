export type {
  CrawlResult,
  CrawlRunStatus,
  NormalizedTender,
  SourceRow,
  TenderDetailPatch,
  TenderDocumentInput,
  TenderNeedingDetail,
} from './types'

export type { CrawlStore } from './store'

export {
  createId,
  mapApiStatus,
  mergeRawData,
  parseJson,
  parseRawData,
  sleep,
  toJson,
  type TenderRawData,
} from './utils'

export {
  createCrawlLogger,
  formatDuration,
  type CreateCrawlLoggerOptions,
  type CrawlLogger,
  type LogMeta,
} from './logger'

export { DEFAULT_CONFIG, SOURCE_SLUG, detailUrl, documentUrl, resolveConfig } from './zakazky-gov/config'

export type {
  ZakazkyGovConfig,
  ZakazkyGovDetailDocument,
  ZakazkyGovDetailResponse,
  ZakazkyGovListItem,
  ZakazkyGovListRequest,
  ZakazkyGovListResponse,
} from './zakazky-gov/types'

export { fetchAllPages, shouldContinuePagination } from './zakazky-gov/client'
export { fetchDetail } from './zakazky-gov/detail-client'
export { mapListItemToTender, mapListResponseToTenders } from './zakazky-gov/mapper'
export { mapDetailToPatch } from './zakazky-gov/detail-mapper'
export { deriveCategoriesFromTags, normalizePortalTags } from './zakazky-gov/categories'

export { runZakazkyGovCrawl } from './zakazky-gov/crawl'
export { runZakazkyGovDetailCrawl, type DetailCrawlOptions } from './zakazky-gov/detail-crawl'
