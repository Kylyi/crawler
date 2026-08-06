import type { TenderDetailPatch, TenderDocumentInput } from '../types'
import {
  deriveCategoriesFromCpv,
  deriveCategoriesFromTags,
  mergeCategories,
  normalizeCpvCode,
  normalizePortalTags,
} from './categories'
import { documentUrl } from './config'
import type { ZakazkyGovDetailDocument, ZakazkyGovDetailResponse } from './types'

function inferMimeType(filename?: string): string | undefined {
  if (!filename) {
    return undefined
  }
  const lower = filename.toLowerCase()
  if (lower.endsWith('.pdf')) {
    return 'application/pdf'
  }
  if (lower.endsWith('.zip')) {
    return 'application/zip'
  }
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  }
  if (lower.endsWith('.doc')) {
    return 'application/msword'
  }

  return undefined
}

function collectCpvCodes(detail: ZakazkyGovDetailResponse): string[] {
  const codes = new Set<string>()

  if (detail.predmet?.hlavni_kod_cpv) {
    codes.add(normalizeCpvCode(detail.predmet.hlavni_kod_cpv))
  }

  for (const part of detail.casti_verejne_zakazky ?? []) {
    if (part.predmet?.hlavni_kod_cpv) {
      codes.add(normalizeCpvCode(part.predmet.hlavni_kod_cpv))
    }
  }

  return [...codes]
}

function mapDocument(
  doc: ZakazkyGovDetailDocument,
  externalId: string,
  portalBaseUrl: string,
): TenderDocumentInput | null {
  if (!doc.odkaz) {
    return null
  }

  return {
    title: doc.nazev,
    url: documentUrl(portalBaseUrl, externalId, doc.odkaz),
    mimeType: inferMimeType(doc.nazev),
  }
}

function collectDocuments(detail: ZakazkyGovDetailResponse, portalBaseUrl: string): TenderDocumentInput[] {
  const documents: TenderDocumentInput[] = []
  const seen = new Set<string>()

  for (const part of detail.casti_verejne_zakazky ?? []) {
    for (const doc of part.zadavaci_postup_pro_cast?.dokumenty ?? []) {
      const mapped = mapDocument(doc, detail.identifikator_NIPEZ, portalBaseUrl)
      if (mapped && !seen.has(mapped.url)) {
        seen.add(mapped.url)
        documents.push(mapped)
      }
    }
  }

  return documents
}

export function mapDetailToPatch(detail: ZakazkyGovDetailResponse, portalBaseUrl: string): TenderDetailPatch {
  const tags = normalizePortalTags(detail.stitky)
  const cpvCodes = collectCpvCodes(detail)
  const categories = mergeCategories(deriveCategoriesFromTags(tags), deriveCategoriesFromCpv(cpvCodes))

  const patch: TenderDetailPatch = {
    description: detail.predmet?.popis_predmetu,
    cpvCodes,
    publishedAt: detail.uverejneniNaZakazkyGov,
    tags,
    categories,
    documents: collectDocuments(detail, portalBaseUrl),
    rawDataDetail: detail,
  }

  if (detail.predpokladana_hodnota_bude_uverejnena && detail.predpokladana_hodnota !== undefined) {
    patch.estimatedValue = detail.predpokladana_hodnota
    patch.currency = detail.mena_predpokladane_hodnoty ?? 'CZK'
  }

  return patch
}
