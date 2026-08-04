import type { NormalizedTender } from '../types'
import { mapApiStatus } from '../utils'
import { deriveCategoriesFromTags, normalizePortalTags } from './categories'
import { detailUrl } from './config'
import type { ZakazkyGovListItem } from './types'

export function mapListItemToTender(item: ZakazkyGovListItem, portalBaseUrl: string): NormalizedTender {
  const externalId = item.identifikator_NIPEZ
  const tags = normalizePortalTags(item.stitky)
  const categories = deriveCategoriesFromTags(tags)

  return {
    externalId,
    title: item.nazev_verejne_zakazky,
    description: item.popis_predmetu,
    contractingAuthority: item.nazev_zadavatele,
    deadlineAt: item.lhuta_pro_podani,
    status: mapApiStatus(item.stav),
    noticeNumber: externalId,
    tags,
    categories,
    url: detailUrl(portalBaseUrl, externalId),
    rawData: { list: item },
  }
}

export function mapListResponseToTenders(items: ZakazkyGovListItem[], portalBaseUrl: string): NormalizedTender[] {
  return items.map((item) => mapListItemToTender(item, portalBaseUrl))
}
