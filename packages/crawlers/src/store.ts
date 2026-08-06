import type {
  CrawlRunStatus,
  NormalizedTender,
  SourceRow,
  TenderDetailPatch,
  TenderDocumentInput,
  TenderNeedingDetail,
} from './types'

/** Framework-agnostic persistence port used by crawl orchestrators. */
export type CrawlStore = {
  getSourceBySlug: (slug: string) => Promise<SourceRow | null>
  startCrawlRun: (sourceSlug: string) => Promise<string>
  finishCrawlRun: (
    runId: string,
    result: {
      status: CrawlRunStatus
      tendersFound: number
      errorMessage?: string
    },
  ) => Promise<void>
  upsertTender: (source: string, tender: NormalizedTender) => Promise<void>
  getTendersNeedingDetail: (source: string, limit: number) => Promise<TenderNeedingDetail[]>
  getTenderByExternalId: (source: string, externalId: string) => Promise<{ id: string } | null>
  enrichTender: (source: string, externalId: string, patch: TenderDetailPatch) => Promise<void>
  markDetailFetched: (source: string, externalId: string) => Promise<void>
  replaceTenderDocuments: (tenderId: string, documents: TenderDocumentInput[]) => Promise<void>
}
