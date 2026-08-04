import { useDatabase } from 'nitro/database'
import type {
  CrawlRunStatus,
  CrawlStore,
  NormalizedTender,
  SourceRow,
  TenderDetailPatch,
  TenderDocumentInput,
  TenderNeedingDetail,
} from 'crawlers'
import { createId, mergeRawData, parseJson, parseRawData, toJson } from 'crawlers'

export async function getSourceBySlug(slug: string): Promise<SourceRow | null> {
  const db = useDatabase()
  const { rows } = await db.sql`
    SELECT id, slug, name, config FROM sources WHERE slug = ${slug} LIMIT 1
  `
  return (rows?.[0] as SourceRow | undefined) ?? null
}

export async function startCrawlRun(sourceSlug: string): Promise<string> {
  const db = useDatabase()
  const source = await getSourceBySlug(sourceSlug)
  const runId = createId()

  await db.sql`
    INSERT INTO crawl_runs (id, source, source_id, status, tenders_found)
    VALUES (
      ${runId},
      ${sourceSlug},
      ${source?.id ?? null},
      ${'running'},
      ${0}
    )
  `

  return runId
}

export async function finishCrawlRun(
  runId: string,
  result: {
    status: CrawlRunStatus
    tendersFound: number
    errorMessage?: string
  },
): Promise<void> {
  const db = useDatabase()

  await db.sql`
    UPDATE crawl_runs
    SET
      status = ${result.status},
      tenders_found = ${result.tendersFound},
      finished_at = datetime('now'),
      error_message = ${result.errorMessage ?? null}
    WHERE id = ${runId}
  `
}

export async function upsertTender(source: string, tender: NormalizedTender): Promise<void> {
  const db = useDatabase()
  const id = createId()
  const cpvCodes = tender.cpvCodes ? toJson(tender.cpvCodes) : null
  const tags = tender.tags?.length ? toJson(tender.tags) : null
  const categories = tender.categories?.length ? toJson(tender.categories) : null

  const { rows: existingRows } = await db.sql`
    SELECT raw_data FROM tenders
    WHERE source = ${source} AND external_id = ${tender.externalId}
    LIMIT 1
  `
  const existingRaw = parseRawData(
    parseJson((existingRows?.[0] as { raw_data: string | null } | undefined)?.raw_data, null),
  )
  const listPayload = parseRawData(tender.rawData).list ?? tender.rawData
  const rawData = toJson(mergeRawData(existingRaw, { list: listPayload }))

  await db.sql`
    INSERT INTO tenders (
      id, source, external_id, title, description, contracting_authority,
      cpv_codes, deadline_at, published_at, url, estimated_value, currency,
      status, raw_data, notice_number, eu_notice_id, tags, categories, last_seen_at
    ) VALUES (
      ${id},
      ${source},
      ${tender.externalId},
      ${tender.title},
      ${tender.description ?? null},
      ${tender.contractingAuthority ?? null},
      ${cpvCodes},
      ${tender.deadlineAt ?? null},
      ${tender.publishedAt ?? null},
      ${tender.url},
      ${tender.estimatedValue ?? null},
      ${tender.currency ?? 'CZK'},
      ${tender.status ?? null},
      ${rawData},
      ${tender.noticeNumber ?? null},
      ${tender.euNoticeId ?? null},
      ${tags},
      ${categories},
      datetime('now')
    )
    ON CONFLICT(source, external_id) DO UPDATE SET
      title = excluded.title,
      description = CASE
        WHEN excluded.description IS NOT NULL
          AND length(excluded.description) > length(COALESCE(tenders.description, ''))
        THEN excluded.description
        ELSE tenders.description
      END,
      contracting_authority = excluded.contracting_authority,
      cpv_codes = COALESCE(excluded.cpv_codes, tenders.cpv_codes),
      deadline_at = excluded.deadline_at,
      published_at = COALESCE(excluded.published_at, tenders.published_at),
      url = excluded.url,
      estimated_value = COALESCE(excluded.estimated_value, tenders.estimated_value),
      currency = COALESCE(excluded.currency, tenders.currency),
      status = excluded.status,
      raw_data = excluded.raw_data,
      notice_number = excluded.notice_number,
      eu_notice_id = COALESCE(excluded.eu_notice_id, tenders.eu_notice_id),
      tags = COALESCE(excluded.tags, tenders.tags),
      categories = COALESCE(excluded.categories, tenders.categories),
      last_seen_at = datetime('now'),
      updated_at = datetime('now')
  `
}

export async function getTendersNeedingDetail(source: string, limit: number): Promise<TenderNeedingDetail[]> {
  const db = useDatabase()
  const { rows } = await db.sql`
    SELECT id, external_id
    FROM tenders
    WHERE source = ${source} AND detail_fetched_at IS NULL
    ORDER BY COALESCE(published_at, updated_at, created_at) DESC
    LIMIT ${limit}
  `

  return (rows ?? []).map((row) => {
    const typed = row as { id: string; external_id: string }
    return {
      id: typed.id,
      externalId: typed.external_id,
    }
  })
}

export async function getTenderByExternalId(source: string, externalId: string): Promise<{ id: string } | null> {
  const db = useDatabase()
  const { rows } = await db.sql`
    SELECT id FROM tenders
    WHERE source = ${source} AND external_id = ${externalId}
    LIMIT 1
  `
  return (rows?.[0] as { id: string } | undefined) ?? null
}

export async function enrichTender(source: string, externalId: string, patch: TenderDetailPatch): Promise<void> {
  const db = useDatabase()

  const { rows: existingRows } = await db.sql`
    SELECT raw_data FROM tenders
    WHERE source = ${source} AND external_id = ${externalId}
    LIMIT 1
  `
  const mergedRaw = mergeRawData(
    parseJson((existingRows?.[0] as { raw_data: string | null } | undefined)?.raw_data, null),
    patch.rawDataDetail !== undefined ? { detail: patch.rawDataDetail } : {},
  )
  const rawData = toJson(mergedRaw)

  const cpvCodes = patch.cpvCodes ? toJson(patch.cpvCodes) : null
  const tags = patch.tags ? toJson(patch.tags) : null
  const categories = patch.categories ? toJson(patch.categories) : null

  await db.sql`
    UPDATE tenders SET
      description = CASE
        WHEN ${patch.description ?? null} IS NOT NULL
          AND length(${patch.description ?? ''}) > length(COALESCE(description, ''))
        THEN ${patch.description ?? null}
        ELSE description
      END,
      cpv_codes = COALESCE(${cpvCodes}, cpv_codes),
      published_at = COALESCE(${patch.publishedAt ?? null}, published_at),
      estimated_value = COALESCE(${patch.estimatedValue ?? null}, estimated_value),
      currency = COALESCE(${patch.currency ?? null}, currency),
      tags = COALESCE(${tags}, tags),
      categories = COALESCE(${categories}, categories),
      raw_data = ${rawData},
      updated_at = datetime('now')
    WHERE source = ${source} AND external_id = ${externalId}
  `
}

export async function markDetailFetched(source: string, externalId: string): Promise<void> {
  const db = useDatabase()
  await db.sql`
    UPDATE tenders
    SET detail_fetched_at = datetime('now'), updated_at = datetime('now')
    WHERE source = ${source} AND external_id = ${externalId}
  `
}

export async function replaceTenderDocuments(tenderId: string, documents: TenderDocumentInput[]): Promise<void> {
  const db = useDatabase()

  await db.sql`
    DELETE FROM tender_documents WHERE tender_id = ${tenderId}
  `

  for (const doc of documents) {
    await db.sql`
      INSERT INTO tender_documents (id, tender_id, title, url, mime_type, fetched_at)
      VALUES (
        ${createId()},
        ${tenderId},
        ${doc.title ?? null},
        ${doc.url},
        ${doc.mimeType ?? null},
        datetime('now')
      )
    `
  }
}

export const nitroCrawlStore: CrawlStore = {
  getSourceBySlug,
  startCrawlRun,
  finishCrawlRun,
  upsertTender,
  getTendersNeedingDetail,
  getTenderByExternalId,
  enrichTender,
  markDetailFetched,
  replaceTenderDocuments,
}
