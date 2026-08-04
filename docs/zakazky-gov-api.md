# Zakázky GOV API (discovered)

Internal JSON API used by the [Zakázky GOV](https://zakazky.gov.cz) SPA. Not officially documented for third parties; treat as unstable.

## List endpoint

|                  |                                                                  |
| ---------------- | ---------------------------------------------------------------- |
| **URL**          | `POST https://api.isd.nipez.cz/isd/seznam/zakazek/hlavni-seznam` |
| **Auth**         | None for public list                                             |
| **Content-Type** | `application/json`                                               |

### Request body

```json
{
  "filtr": {
    "skupinaZakazek": "AKTIVNI"
  },
  "strankovani": {
    "stranka": 1,
    "pocet_zaznamu": 50
  },
  "razeni": {
    "atribut": "DATUM_UVEREJNENI_NA_ZAKAZKY_GOV",
    "typ_razeni": "SESTUPNE"
  }
}
```

| Field                       | Values                            | Notes                              |
| --------------------------- | --------------------------------- | ---------------------------------- |
| `filtr.skupinaZakazek`      | `AKTIVNI`, `VSE`                  | `AKTIVNI` = active tenders only    |
| `strankovani.stranka`       | 1-based page number               |                                    |
| `strankovani.pocet_zaznamu` | page size                         | UI default is 10                   |
| `razeni.atribut`            | `DATUM_UVEREJNENI_NA_ZAKAZKY_GOV` | Sort by publication date on portal |
| `razeni.typ_razeni`         | `SESTUPNE`, `VZESTUPNE`           | Descending / ascending             |

### Response

```json
{
  "polozky": [
    {
      "identifikator_NIPEZ": "RVZ2600114099",
      "nazev_verejne_zakazky": "…",
      "popis_predmetu": "…",
      "nazev_zadavatele": "Město Kraslice",
      "lhuta_pro_podani": "2026-08-20T08:00:00Z",
      "stav": "AKTIVNI_NEUKONCEN",
      "typ_zadavaciho_postupu": "VEREJNA_ZAKAZKA",
      "stitky": ["#ItSluzby", "#OdborneSluzby"]
    }
  ],
  "posledni_stranka": false
}
```

Pagination stops when `posledni_stranka` is `true` or `polozky` is empty.

## Field mapping → `tenders` table

| API field               | DB column                                                            |
| ----------------------- | -------------------------------------------------------------------- |
| `identifikator_NIPEZ`   | `external_id`, `notice_number`                                       |
| `nazev_verejne_zakazky` | `title`                                                              |
| `popis_predmetu`        | `description`                                                        |
| `nazev_zadavatele`      | `contracting_authority`                                              |
| `lhuta_pro_podani`      | `deadline_at` (ISO 8601)                                             |
| `stav`                  | `status`                                                             |
| `stitky`                | `tags` (portal labels, e.g. `ItSluzby`)                              |
| derived from `stitky`   | `categories` (normalized sectors, e.g. `IT`)                         |
| —                       | `url` = `https://zakazky.gov.cz/verejne-zakazky/detail-zakazky/{id}` |
| full item object        | `raw_data.list` (JSON); detail pass adds `raw_data.detail`           |

## Detail endpoint

|             |                                                                            |
| ----------- | -------------------------------------------------------------------------- |
| **URL**     | `GET https://api.isd.nipez.cz/isd/detail/zakazky/verejna-zakazka/{RVZ_ID}` |
| **Auth**    | None for public detail                                                     |
| **Example** | `RVZ2600114099`                                                            |

DNS and non-`verejna-zakazka` detail paths are not handled in v1. A 404 is logged and the tender stays in the queue (`detail_fetched_at` remains null).

### Detail field mapping → `tenders` / `tender_documents`

| API field                                                      | DB column / table                                                |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| `predmet.hlavni_kod_cpv` (+ part-level CPVs)                   | `cpv_codes` (normalized, e.g. `72000000` → `72000000-5`)         |
| `uverejneniNaZakazkyGov`                                       | `published_at`                                                   |
| `predmet.popis_predmetu`                                       | `description` (when longer than list snippet)                    |
| `stitky`                                                       | `tags`; `categories` via tag + CPV rules                         |
| CPV prefix `72`                                                | adds `IT` to `categories`                                        |
| `predpokladana_hodnota` + currency                             | `estimated_value`, `currency` (when published)                   |
| `casti_verejne_zakazky[].zadavaci_postup_pro_cast.dokumenty[]` | `tender_documents` (`title`, anchor `url`, inferred `mime_type`) |

Document URLs in v1 use a stable portal anchor: `https://zakazky.gov.cz/verejne-zakazky/detail-zakazky/{id}#doc-{uuid}` (API `odkaz` is an opaque UUID, not a direct download URL).

Detail crawl runs as a separate Nitro task (`crawl-zakazky-gov-detail`), cron at `:15` and `:45`, manual trigger `POST /api/crawl/zakazky-gov/detail?limit=50`.

## Status values

| API `stav`          | Meaning             |
| ------------------- | ------------------- |
| `AKTIVNI_NEUKONCEN` | Active, open        |
| `DOKONCEN_ZADAN`    | Completed / awarded |

## Crawler settings

Default config in `sources.config` for slug `zakazky-gov`:

```json
{
  "apiUrl": "https://api.isd.nipez.cz/isd/seznam/zakazek/hlavni-seznam",
  "portalBaseUrl": "https://zakazky.gov.cz",
  "skupinaZakazek": "AKTIVNI",
  "pageSize": 50,
  "maxPages": 100,
  "requestDelayMs": 500,
  "detailApiUrl": "https://api.isd.nipez.cz/isd/detail/zakazky/verejna-zakazka",
  "detailBatchSize": 100,
  "detailRequestDelayMs": 300,
  "detailMaxPerRun": 200
}
```

## Fixtures

Sample responses: [`apps/fe-vue/server/crawlers/zakazky-gov/fixtures/`](../apps/fe-vue/server/crawlers/zakazky-gov/fixtures/)

## Plan B (not implemented)

If this endpoint is blocked: [ISVZ open data](https://isvz.nipez.cz/opendata) / RVZ machine interfaces per NIPEZ rules.
