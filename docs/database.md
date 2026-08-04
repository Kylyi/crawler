# Database (Cloudflare D1)

This document records the database decision and setup for the `fe-vue` crawler application.

## Decision

We use **Cloudflare D1** as the primary database because:

- The app is deployed to **Cloudflare Workers** via Nitro (`cloudflare_module` preset).
- D1 is SQLite-compatible, serverless, and co-located with the Worker runtime.
- No separate database hosting or connection pooling is required.
- Nitro provides a built-in database layer (`useDatabase()`) with a `cloudflare-d1` connector.

For local development, Nitro uses a **local SQLite file** (`.data/dev-db.sqlite`) via the `devDatabase` config, so developers can work without Cloudflare credentials.

Schema changes are applied via **Wrangler D1 migrations** (`wrangler d1 migrations apply`), which tracks applied files and skips them on re-run.

## Configuration

| Setting              | Value                                  |
| -------------------- | -------------------------------------- |
| Database name        | `fe-vue-db`                            |
| D1 binding           | `DB`                                   |
| Database ID          | `1d6aed09-986f-4fc2-8998-8ae7c80f5504` |
| Region               | EEUR                                   |
| Local dev connector  | `sqlite` (`.data/dev-db.sqlite`)       |
| Production connector | `cloudflare-d1` (binding `DB`)         |

Configuration files:

- [`apps/fe-vue/nitro.config.ts`](../apps/fe-vue/nitro.config.ts) — Nitro database and Cloudflare wrangler settings
- [`apps/fe-vue/wrangler.jsonc`](../apps/fe-vue/wrangler.jsonc) — D1 binding for local Wrangler dev/preview

## Schema

Full entity-relationship documentation: [schema.md](./schema.md)

Migrations (apply in order):

| File                                                                                                   | Purpose                                               |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| [`001_initial.sql`](../apps/fe-vue/server/db/migrations/001_initial.sql)                               | `tenders`, `crawl_runs`                               |
| [`002_goals_schema.sql`](../apps/fe-vue/server/db/migrations/002_goals_schema.sql)                     | `procedures`, capabilities, matching, offers, sources |
| [`003_zakazky_gov_config.sql`](../apps/fe-vue/server/db/migrations/003_zakazky_gov_config.sql)         | Default `sources.config` for Zakázky GOV crawler      |
| [`004_tender_tags_categories.sql`](../apps/fe-vue/server/db/migrations/004_tender_tags_categories.sql) | `tags` and `categories` on `tenders`                  |

Migrations live in [`apps/fe-vue/server/db/migrations/`](../apps/fe-vue/server/db/migrations/) (`migrations_dir` in `wrangler.jsonc`).

When adding schema changes, create a new numbered SQL file (e.g. `003_add_foo.sql`) and run `pnpm db:apply:local`.

### Table groups

| Group        | Tables                                                            |
| ------------ | ----------------------------------------------------------------- |
| Ingestion    | `sources`, `tenders`, `crawl_runs`, `tender_documents`            |
| Comparison   | `procedures`, `tender_conflicts`                                  |
| Capabilities | `capabilities`, `capability_relations`                            |
| Matching     | `tender_requirements`, `procedure_matches`, `requirement_matches` |
| Offers       | `offers`, `offer_items`                                           |

**`tenders`** — Per-source ingested records (not the canonical view). Unique on `(source, external_id)`. Linked to `procedures` after deduplication.

**`procedures`** — Canonical merged tender — what users browse, match, and bid on.

**`crawl_runs`** — Audit log for crawler executions per source.

## Applying schema

From `apps/fe-vue`:

```bash
# Apply pending migrations to local D1 (Wrangler emulation)
pnpm db:apply:local

# Apply pending migrations to remote D1 (production)
pnpm db:apply:remote

# List migration status
pnpm db:migrations:list
```

Re-running `db:apply:*` is safe — Wrangler records applied migrations and only runs new files.

### Local dev database (`vp dev`)

Nitro dev uses a separate SQLite file at `.data/dev-db.sqlite` (not Wrangler D1). After applying Wrangler migrations, also apply new SQL files to dev SQLite if you use `vp dev`:

```bash
sqlite3 .data/dev-db.sqlite < server/db/migrations/002_goals_schema.sql
sqlite3 .data/dev-db.sqlite < server/db/migrations/003_zakazky_gov_config.sql
```

Or reset dev DB and replay all migrations from scratch.

### Reset local database (dev only)

If local schema state is inconsistent (e.g. from earlier manual `d1 execute --file` runs before migrations were tracked):

```bash
rm -rf .wrangler/state/v3/d1
pnpm db:apply:local
```

## Usage in code

```ts
import { useDatabase } from 'nitro/database'

const db = useDatabase()

const { rows } = await db.sql`
  SELECT * FROM tenders
  WHERE source = ${source}
  ORDER BY published_at DESC
  LIMIT ${limit}
`
```

## Health check

`GET /api/db/health` returns whether the schema is ready and the current tender count. Returns `ready: false` if the `tenders` table does not exist yet.

## Initial setup (one-time)

The D1 database `fe-vue-db` was created with:

```bash
wrangler d1 create fe-vue-db
```

If setting up a new environment, recreate the database and update `database_id` in `wrangler.jsonc`.
