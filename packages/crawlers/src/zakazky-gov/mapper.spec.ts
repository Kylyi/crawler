import { describe, expect, it } from 'vite-plus/test'
import listPage1 from './fixtures/list-page-1.json'
import { mapListItemToTender, mapListResponseToTenders } from './mapper'
import type { ZakazkyGovListItem } from './types'

const PORTAL = 'https://zakazky.gov.cz'

describe('mapListItemToTender', () => {
  it('maps API fields to normalized tender', () => {
    const item = listPage1.polozky[1] as ZakazkyGovListItem
    const tender = mapListItemToTender(item, PORTAL)

    expect(tender.externalId).toBe('RVZ2600114099')
    expect(tender.title).toContain('ICT služeb')
    expect(tender.contractingAuthority).toBe('Město Kraslice')
    expect(tender.deadlineAt).toBe('2026-08-20T08:00:00Z')
    expect(tender.status).toBe('active')
    expect(tender.noticeNumber).toBe('RVZ2600114099')
    expect(tender.url).toBe('https://zakazky.gov.cz/verejne-zakazky/detail-zakazky/RVZ2600114099')
    expect(tender.tags).toEqual(['ItSluzby', 'OdborneSluzby'])
    expect(tender.categories).toEqual(['IT', 'Services'])
    expect(tender.rawData).toEqual({ list: item })
  })

  it('maps completed status', () => {
    const item: ZakazkyGovListItem = {
      identifikator_NIPEZ: 'RVZ2600114033',
      nazev_verejne_zakazky: 'Test',
      stav: 'DOKONCEN_ZADAN',
    }
    expect(mapListItemToTender(item, PORTAL).status).toBe('completed')
  })
})

describe('mapListResponseToTenders', () => {
  it('maps all items from list response', () => {
    const tenders = mapListResponseToTenders(listPage1.polozky, PORTAL)
    expect(tenders).toHaveLength(3)
    expect(tenders[0]?.externalId).toBe('RVZ2600114100')
  })
})
