import { describe, expect, it } from 'vite-plus/test'
import detailFixture from './fixtures/detail-RVZ2600114099.json'
import { mapDetailToPatch } from './detail-mapper'
import type { ZakazkyGovDetailResponse } from './types'

const PORTAL = 'https://zakazky.gov.cz'

describe('mapDetailToPatch', () => {
  it('maps CPV codes, published date, tags, and categories', () => {
    const patch = mapDetailToPatch(detailFixture as ZakazkyGovDetailResponse, PORTAL)

    expect(patch.cpvCodes).toEqual(['72000000-5'])
    expect(patch.publishedAt).toBe('2026-07-31T15:42:53.008Z')
    expect(patch.tags).toEqual(['ItSluzby', 'OdborneSluzby'])
    expect(patch.categories).toEqual(['IT', 'Services'])
    expect(patch.description).toContain('ICT prostředí')
    expect(patch.rawDataDetail).toBeDefined()
  })

  it('extracts document metadata with stable portal anchor URLs', () => {
    const patch = mapDetailToPatch(detailFixture as ZakazkyGovDetailResponse, PORTAL)

    expect(patch.documents).toHaveLength(2)
    expect(patch.documents?.[0]?.title).toBe('Přílohy ZD.zip')
    expect(patch.documents?.[0]?.url).toContain('#doc-1c1e9c14-e884-4213-bfed-529491491e25')
    expect(patch.documents?.[1]?.mimeType).toBe('application/pdf')
  })
})
