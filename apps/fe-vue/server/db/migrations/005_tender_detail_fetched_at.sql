-- Track when tender detail has been fetched
ALTER TABLE tenders ADD COLUMN detail_fetched_at TEXT;

CREATE INDEX IF NOT EXISTS idx_tenders_detail_fetched_at ON tenders(detail_fetched_at);
