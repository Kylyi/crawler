CREATE TABLE IF NOT EXISTS tenders (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  contracting_authority TEXT,
  cpv_codes TEXT,
  deadline_at TEXT,
  published_at TEXT,
  url TEXT,
  estimated_value REAL,
  currency TEXT NOT NULL DEFAULT 'CZK',
  status TEXT,
  raw_data TEXT,
  tags TEXT,
  categories TEXT,
  detail_fetched_at TEXT,
  procedure_id TEXT,
  notice_number TEXT,
  eu_notice_id TEXT,
  last_seen_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(source, external_id)
);

CREATE INDEX IF NOT EXISTS idx_tenders_source ON tenders(source);
CREATE INDEX IF NOT EXISTS idx_tenders_deadline_at ON tenders(deadline_at);
CREATE INDEX IF NOT EXISTS idx_tenders_published_at ON tenders(published_at);
CREATE INDEX IF NOT EXISTS idx_tenders_status ON tenders(status);
CREATE INDEX IF NOT EXISTS idx_tenders_categories ON tenders(categories);
CREATE INDEX IF NOT EXISTS idx_tenders_detail_fetched_at ON tenders(detail_fetched_at);
CREATE INDEX IF NOT EXISTS idx_tenders_procedure_id ON tenders(procedure_id);
CREATE INDEX IF NOT EXISTS idx_tenders_notice_number ON tenders(notice_number);
CREATE INDEX IF NOT EXISTS idx_tenders_eu_notice_id ON tenders(eu_notice_id);

CREATE TABLE IF NOT EXISTS crawl_runs (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  source_id TEXT,
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  finished_at TEXT,
  status TEXT NOT NULL,
  tenders_found INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_crawl_runs_source ON crawl_runs(source);
CREATE INDEX IF NOT EXISTS idx_crawl_runs_source_id ON crawl_runs(source_id);
CREATE INDEX IF NOT EXISTS idx_crawl_runs_started_at ON crawl_runs(started_at);
