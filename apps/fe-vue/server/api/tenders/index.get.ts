import { defineHandler } from 'nitro'
import { useDatabase } from 'nitro/database'
import { parseJson } from 'crawlers'

export type TenderListItem = {
  id: string
  source: string
  externalId: string
  title: string
  contractingAuthority: string | null
  deadlineAt: string | null
  publishedAt: string | null
  status: string | null
  cpvCodes: string[]
  tags: string[]
  categories: string[]
  url: string
  detailFetched: boolean
}

export type TenderListResponse = {
  items: TenderListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

function parseStringArray(value: string | null): string[] {
  if (!value) {
    return []
  }
  return parseJson<string[]>(value, [])
}

export default defineHandler(async (event) => {
  const db = useDatabase()
  const params = event.url.searchParams

  const source = params.get('source') ?? 'zakazky-gov'
  const category = params.get('category')
  const search = params.get('q')?.trim()
  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1)
  const pageSize = Math.min(100, Math.max(1, Number.parseInt(params.get('pageSize') ?? '25', 10) || 25))
  const offset = (page - 1) * pageSize

  const categoryFilter = category ? `%"${category.replace(/"/g, '')}"%` : null
  const searchFilter = search ? `%${search}%` : null

  const { rows: countRows } = await db.sql`
    SELECT COUNT(*) AS count FROM tenders
    WHERE source = ${source}
      AND (${categoryFilter} IS NULL OR categories LIKE ${categoryFilter})
      AND (${searchFilter} IS NULL OR title LIKE ${searchFilter} OR contracting_authority LIKE ${searchFilter})
  `
  const total = (countRows?.[0] as { count: number } | undefined)?.count ?? 0

  const { rows } = await db.sql`
    SELECT
      id, source, external_id, title, contracting_authority,
      deadline_at, published_at, status, cpv_codes, tags, categories, url,
      detail_fetched_at
    FROM tenders
    WHERE source = ${source}
      AND (${categoryFilter} IS NULL OR categories LIKE ${categoryFilter})
      AND (${searchFilter} IS NULL OR title LIKE ${searchFilter} OR contracting_authority LIKE ${searchFilter})
    ORDER BY COALESCE(deadline_at, published_at, updated_at) DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `

  const items: TenderListItem[] = (rows ?? []).map((row) => {
    const typed = row as {
      id: string
      source: string
      external_id: string
      title: string
      contracting_authority: string | null
      deadline_at: string | null
      published_at: string | null
      status: string | null
      cpv_codes: string | null
      tags: string | null
      categories: string | null
      url: string
      detail_fetched_at: string | null
    }
    return {
      id: typed.id,
      source: typed.source,
      externalId: typed.external_id,
      title: typed.title,
      contractingAuthority: typed.contracting_authority,
      deadlineAt: typed.deadline_at,
      publishedAt: typed.published_at,
      status: typed.status,
      cpvCodes: parseStringArray(typed.cpv_codes),
      tags: parseStringArray(typed.tags),
      categories: parseStringArray(typed.categories),
      url: typed.url,
      detailFetched: typed.detail_fetched_at != null,
    }
  })

  const response: TenderListResponse = {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  }

  return response
})
