export type CrawlRunStatus = 'running' | 'success' | 'failed'

export type NormalizedTender = {
  externalId: string
  title: string
  description?: string
  contractingAuthority?: string
  cpvCodes?: string[]
  deadlineAt?: string
  publishedAt?: string
  url: string
  estimatedValue?: number
  currency?: string
  status?: string
  noticeNumber?: string
  euNoticeId?: string
  tags?: string[]
  categories?: string[]
  rawData: unknown
}

export type CrawlResult = {
  runId: string
  source: string
  tendersFound: number
  pagesFetched: number
  durationMs: number
  status: CrawlRunStatus
  error?: string
}

export type TenderDocumentInput = {
  title?: string
  url: string
  mimeType?: string
}

export type TenderDetailPatch = Partial<Omit<NormalizedTender, 'externalId' | 'url' | 'rawData'>> & {
  documents?: TenderDocumentInput[]
  rawDataDetail?: unknown
}

export type TenderNeedingDetail = {
  id: string
  externalId: string
}

export type SourceRow = {
  id: string
  slug: string
  name: string
  config: string | null
}
