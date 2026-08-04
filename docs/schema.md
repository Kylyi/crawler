# Database Schema

Entity-relationship overview for the crawler application. See [database.md](./database.md) for D1 setup and [goals.md](./goals.md) for why these tables exist.

Migrations:

- [`001_initial.sql`](../apps/fe-vue/server/db/migrations/001_initial.sql) — source-level `tenders`, `crawl_runs`
- [`002_goals_schema.sql`](../apps/fe-vue/server/db/migrations/002_goals_schema.sql) — procedures, capabilities, matching, offers

## Entity Relationship Diagram

```mermaid
erDiagram
  sources ||--o{ crawl_runs : logs
  sources ||--o{ tenders : "slug via source column"

  procedures ||--o{ tenders : "merged into"
  procedures ||--o{ tender_conflicts : has
  procedures ||--o{ tender_requirements : has
  procedures ||--o| procedure_matches : "scored by"
  procedures ||--o{ offers : "offer for"

  tenders ||--o{ tender_documents : attachments
  tenders ||--o{ tender_conflicts : "compared in"

  capabilities ||--o{ capabilities : "parent hierarchy"
  capabilities ||--o{ capability_relations : from
  capabilities ||--o{ capability_relations : to
  capabilities ||--o{ requirement_matches : "evidence for"
  capabilities ||--o{ offer_items : "cited in"

  procedure_matches ||--o{ requirement_matches : breakdown
  tender_requirements ||--o{ requirement_matches : matched
  tender_requirements ||--o{ offer_items : addressed

  offers ||--o{ offer_items : contains
```

## Design Principles

1. **`tenders` = source records** — one row per `(source, external_id)`. Never delete source fidelity; merge happens at the `procedures` layer.
2. **`procedures` = canonical opportunity** — what the user browses, matches, and bids on.
3. **`capabilities` = unified company profile** — discriminated by `kind`; optional hierarchy via `parent_id` (e.g. product → features).
4. **JSON columns** — `metadata`, `evidence`, `tags`, `cpv_codes`, `matched_capabilities`, `gaps` stay flexible without schema churn.
5. **Single-tenant** — no `organization_id`; one company deployment for now.

---

## Ingestion & Sources

### `sources`

Configured crawl/API targets.

| Column                     | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| `slug`                     | Stable identifier used in `tenders.source` (e.g. `hlidac-statu`) |
| `access_method`            | `api`, `rss`, `scrape`, `dump`                                   |
| `config`                   | JSON: API tokens (refs), CPV filters, instance URLs              |
| `refresh_interval_minutes` | Expected poll cadence                                            |

Seeded with 10 Czech/EU sources from [tender-sources.md](./tender-sources.md).

### `tenders` (extended in 002)

Per-source ingested record. Unique on `(source, external_id)`.

New columns:

| Column          | Description                                              |
| --------------- | -------------------------------------------------------- |
| `procedure_id`  | FK → merged canonical procedure (nullable until deduped) |
| `notice_number` | National notice ID for cross-source matching             |
| `eu_notice_id`  | TED / EU notice number                                   |
| `last_seen_at`  | Last time this record appeared in a crawl                |

### `crawl_runs`

Execution audit log per source run. Adds optional `source_id` FK.

### `tender_documents`

Links to PDFs, specifications, and attachments found on source pages.

---

## Cross-Source Comparison

### `procedures`

Canonical procurement procedure — the deduplicated “one tender” view.

| Column                           | Description                                                         |
| -------------------------------- | ------------------------------------------------------------------- |
| `dedup_key`                      | Computed key used to group source records (e.g. EU notice ID)       |
| `notice_number` / `eu_notice_id` | Primary matching identifiers                                        |
| `tags`                           | JSON array of portal labels (Zakázky GOV `stitky`, e.g. `ItSluzby`) |
| `categories`                     | JSON array of normalized sectors (e.g. `IT`, `Construction`)        |
| `primary_url`                    | Best link chosen from sources                                       |
| `merge_notes`                    | Human or algorithm notes on merge decisions                         |

### `tender_conflicts`

Field-level disagreements when two source records map to the same procedure.

| Column                   | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `field_name`             | e.g. `deadline_at`, `estimated_value`, `status` |
| `tender_a_id`, `value_a` | First source value                              |
| `tender_b_id`, `value_b` | Second source value                             |
| `resolution`             | `unresolved`, `use_a`, `use_b`, `manual`        |
| `resolved_value`         | Final merged value when resolved                |

**Typical flow:** Crawler ingests → dedup assigns `procedure_id` → merge job writes `procedures` → conflict detector populates `tender_conflicts`.

---

## Capabilities

### `capabilities`

What the company can deliver.

| `kind`              | Use for                                          |
| ------------------- | ------------------------------------------------ |
| `service`           | Custom development, integration, support         |
| `technology`        | Languages, frameworks, cloud, databases          |
| `product`           | Named products / platforms                       |
| `certification`     | ISO, security, sector compliance                 |
| `reference_project` | Past public-sector work                          |
| `constraint`        | Capacity limits, geography, min/max project size |

| Column      | Description                                              |
| ----------- | -------------------------------------------------------- |
| `parent_id` | Hierarchy (product → feature, service → sub-service)     |
| `metadata`  | JSON: cert expiry, contract value, licensing model, etc. |
| `evidence`  | JSON: case study URLs, document refs                     |
| `tags`      | JSON array for fuzzy matching                            |

### `capability_relations`

Directed links between capabilities.

| `relation_type`   | Example                                   |
| ----------------- | ----------------------------------------- |
| `includes`        | Product includes a feature capability     |
| `requires`        | Service requires a certification          |
| `built_with`      | Product built_with a technology           |
| `demonstrated_by` | Service demonstrated_by reference project |
| `related`         | Loose association                         |

---

## Matching

### `tender_requirements`

Individual requirements extracted from a procedure (manual entry first; parsing later).

Categories: `technical`, `qualification`, `commercial`, `legal`, `other`.

### `procedure_matches`

Cached fit score for a procedure (one row per procedure).

| Column                 | Description                              |
| ---------------------- | ---------------------------------------- |
| `score`                | 0–100 overall fit                        |
| `matched_capabilities` | JSON: capability IDs with partial scores |
| `gaps`                 | JSON: unmet requirement IDs              |
| `summary`              | Human-readable match summary             |

### `requirement_matches`

Per-requirement breakdown linked to the cached procedure match.

Statuses: `matched`, `partial`, `gap`, `unknown`.

---

## Offer Preparation

### `offers`

Draft offer for a procedure. Status workflow: `draft` → `review` → `ready` → `submitted` → `archived`.

### `offer_items`

Line items mapping requirements to capabilities and response text.

| `coverage_status` | Meaning                                     |
| ----------------- | ------------------------------------------- |
| `covered`         | Fully addressed with evidence               |
| `partial`         | Partially addressed                         |
| `gap`             | Not covered — needs action or subcontractor |
| `n_a`             | Not applicable                              |

---

## Example Queries

**Procedures with multiple sources (dedup candidates):**

```sql
SELECT p.id, p.title, COUNT(t.id) AS source_count
FROM procedures p
JOIN tenders t ON t.procedure_id = p.id
GROUP BY p.id
HAVING source_count > 1;
```

**Unresolved conflicts for a procedure:**

```sql
SELECT field_name, value_a, value_b
FROM tender_conflicts
WHERE procedure_id = ? AND resolution = 'unresolved';
```

**Top matching procedures:**

```sql
SELECT p.title, p.deadline_at, pm.score
FROM procedures p
JOIN procedure_matches pm ON pm.procedure_id = p.id
ORDER BY pm.score DESC, p.deadline_at ASC
LIMIT 20;
```

**Offer checklist with gaps:**

```sql
SELECT tr.title, oi.coverage_status, oi.response_text, c.name AS capability
FROM offer_items oi
LEFT JOIN tender_requirements tr ON tr.id = oi.requirement_id
LEFT JOIN capabilities c ON c.id = oi.capability_id
WHERE oi.offer_id = ?
ORDER BY oi.sort_order;
```
