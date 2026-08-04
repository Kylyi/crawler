export type ZakazkyGovListItem = {
  identifikator_NIPEZ: string
  nazev_verejne_zakazky: string
  popis_predmetu?: string
  nazev_zadavatele?: string
  lhuta_pro_podani?: string
  stav: string
  typ_zadavaciho_postupu?: string
  stitky?: string[]
}

export type ZakazkyGovListResponse = {
  polozky: ZakazkyGovListItem[]
  posledni_stranka: boolean
}

export type ZakazkyGovListRequest = {
  filtr: {
    skupinaZakazek: string
  }
  strankovani: {
    stranka: number
    pocet_zaznamu: number
  }
  razeni: {
    atribut: string
    typ_razeni: string
  }
}

export type ZakazkyGovConfig = {
  apiUrl: string
  portalBaseUrl: string
  skupinaZakazek: string
  pageSize: number
  maxPages: number
  requestDelayMs: number
  sortAttribute: string
  sortDirection: string
  detailApiUrl: string
  detailBatchSize: number
  detailRequestDelayMs: number
  detailMaxPerRun: number
}

export type ZakazkyGovDetailDocument = {
  typ_dokumentu?: string
  nazev?: string
  odkaz?: string
  velikost?: number
  datum_vytvoreni?: string
  dokument_uverejnen?: boolean
  dokument_nahran?: boolean
}

export type ZakazkyGovDetailPart = {
  predmet?: {
    hlavni_kod_cpv?: string
    popis_predmetu?: string
  }
  zadavaci_postup_pro_cast?: {
    dokumenty?: ZakazkyGovDetailDocument[]
  }
}

export type ZakazkyGovDetailResponse = {
  identifikator_NIPEZ: string
  nazev_verejne_zakazky?: string
  predpokladana_hodnota?: number
  predpokladana_hodnota_bude_uverejnena?: boolean
  mena_predpokladane_hodnoty?: string
  predmet?: {
    popis_predmetu?: string
    hlavni_kod_cpv?: string
  }
  casti_verejne_zakazky?: ZakazkyGovDetailPart[]
  uverejneniNaZakazkyGov?: string
  stitky?: string[]
}
