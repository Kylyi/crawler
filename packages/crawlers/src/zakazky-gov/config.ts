import type { SourceRow } from '../types'
import { parseJson } from '../utils'
import type { ZakazkyGovConfig } from './types'

export const SOURCE_SLUG = 'zakazky-gov'

export const DEFAULT_CONFIG: ZakazkyGovConfig = {
  apiUrl: 'https://api.isd.nipez.cz/isd/seznam/zakazek/hlavni-seznam',
  portalBaseUrl: 'https://zakazky.gov.cz',
  skupinaZakazek: 'AKTIVNI',
  pageSize: 50,
  maxPages: 100,
  requestDelayMs: 500,
  sortAttribute: 'DATUM_UVEREJNENI_NA_ZAKAZKY_GOV',
  sortDirection: 'SESTUPNE',
  detailApiUrl: 'https://api.isd.nipez.cz/isd/detail/zakazky/verejna-zakazka',
  detailBatchSize: 100,
  detailRequestDelayMs: 1500,
  detailMaxPerRun: 200,
}

export function documentUrl(portalBaseUrl: string, externalId: string, documentId: string): string {
  return `${detailUrl(portalBaseUrl, externalId)}#doc-${documentId}`
}

export function resolveConfig(source: SourceRow | null): ZakazkyGovConfig {
  const fromDb = parseJson<Partial<ZakazkyGovConfig>>(source?.config, {})
  return { ...DEFAULT_CONFIG, ...fromDb }
}

export function detailUrl(portalBaseUrl: string, externalId: string): string {
  return `${portalBaseUrl.replace(/\/$/, '')}/verejne-zakazky/detail-zakazky/${externalId}`
}
