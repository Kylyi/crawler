-- Goals-oriented schema: procedures, capabilities, matching, offers, source comparison.
-- Depends on 001_initial.sql (tenders, crawl_runs).

-- ---------------------------------------------------------------------------
-- Sources & ingestion
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  base_url TEXT,
  access_method TEXT NOT NULL CHECK (access_method IN ('api', 'rss', 'scrape', 'dump')),
  enabled INTEGER NOT NULL DEFAULT 1,
  refresh_interval_minutes INTEGER NOT NULL DEFAULT 60,
  config TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sources_enabled ON sources(enabled);

-- ---------------------------------------------------------------------------
-- Canonical procedures (merged view across sources)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS procedures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  contracting_authority TEXT,
  cpv_codes TEXT,
  deadline_at TEXT,
  published_at TEXT,
  estimated_value REAL,
  currency TEXT NOT NULL DEFAULT 'CZK',
  status TEXT,
  primary_url TEXT,
  notice_number TEXT,
  eu_notice_id TEXT,
  dedup_key TEXT,
  merge_notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_procedures_deadline_at ON procedures(deadline_at);
CREATE INDEX IF NOT EXISTS idx_procedures_published_at ON procedures(published_at);
CREATE INDEX IF NOT EXISTS idx_procedures_status ON procedures(status);
CREATE INDEX IF NOT EXISTS idx_procedures_notice_number ON procedures(notice_number);
CREATE INDEX IF NOT EXISTS idx_procedures_eu_notice_id ON procedures(eu_notice_id);
CREATE INDEX IF NOT EXISTS idx_procedures_dedup_key ON procedures(dedup_key);

-- Field-level disagreements between source records for the same procedure
CREATE TABLE IF NOT EXISTS tender_conflicts (
  id TEXT PRIMARY KEY,
  procedure_id TEXT NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  tender_a_id TEXT NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  value_a TEXT,
  tender_b_id TEXT NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  value_b TEXT,
  resolution TEXT NOT NULL DEFAULT 'unresolved'
    CHECK (resolution IN ('unresolved', 'use_a', 'use_b', 'manual')),
  resolved_value TEXT,
  detected_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_tender_conflicts_procedure_id ON tender_conflicts(procedure_id);
CREATE INDEX IF NOT EXISTS idx_tender_conflicts_resolution ON tender_conflicts(resolution);

-- Documents and attachments discovered on source pages
CREATE TABLE IF NOT EXISTS tender_documents (
  id TEXT PRIMARY KEY,
  tender_id TEXT NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
  title TEXT,
  url TEXT NOT NULL,
  mime_type TEXT,
  fetched_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tender_documents_tender_id ON tender_documents(tender_id);

-- Requirements extracted from tender text (manual or automated)
CREATE TABLE IF NOT EXISTS tender_requirements (
  id TEXT PRIMARY KEY,
  procedure_id TEXT NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  source_tender_id TEXT REFERENCES tenders(id) ON DELETE SET NULL,
  category TEXT CHECK (category IN ('technical', 'qualification', 'commercial', 'legal', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  mandatory INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  extraction_method TEXT NOT NULL DEFAULT 'manual'
    CHECK (extraction_method IN ('manual', 'keyword', 'parsed')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tender_requirements_procedure_id ON tender_requirements(procedure_id);
CREATE INDEX IF NOT EXISTS idx_tender_requirements_category ON tender_requirements(category);

-- ---------------------------------------------------------------------------
-- Company capabilities
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS capabilities (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN (
    'service', 'technology', 'product', 'certification', 'reference_project', 'constraint'
  )),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  parent_id TEXT REFERENCES capabilities(id) ON DELETE SET NULL,
  metadata TEXT,
  evidence TEXT,
  tags TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_capabilities_kind ON capabilities(kind);
CREATE INDEX IF NOT EXISTS idx_capabilities_parent_id ON capabilities(parent_id);
CREATE INDEX IF NOT EXISTS idx_capabilities_active ON capabilities(active);

-- Relationships between capabilities (e.g. product built_with technology)
CREATE TABLE IF NOT EXISTS capability_relations (
  id TEXT PRIMARY KEY,
  from_capability_id TEXT NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  to_capability_id TEXT NOT NULL REFERENCES capabilities(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL CHECK (relation_type IN (
    'includes', 'requires', 'built_with', 'demonstrated_by', 'related'
  )),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(from_capability_id, to_capability_id, relation_type)
);

CREATE INDEX IF NOT EXISTS idx_capability_relations_from ON capability_relations(from_capability_id);
CREATE INDEX IF NOT EXISTS idx_capability_relations_to ON capability_relations(to_capability_id);

-- ---------------------------------------------------------------------------
-- Matching procedures against capabilities
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS procedure_matches (
  id TEXT PRIMARY KEY,
  procedure_id TEXT NOT NULL UNIQUE REFERENCES procedures(id) ON DELETE CASCADE,
  score REAL NOT NULL,
  matched_capabilities TEXT,
  gaps TEXT,
  summary TEXT,
  computed_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_procedure_matches_score ON procedure_matches(score);

CREATE TABLE IF NOT EXISTS requirement_matches (
  id TEXT PRIMARY KEY,
  procedure_match_id TEXT NOT NULL REFERENCES procedure_matches(id) ON DELETE CASCADE,
  requirement_id TEXT NOT NULL REFERENCES tender_requirements(id) ON DELETE CASCADE,
  capability_id TEXT REFERENCES capabilities(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('matched', 'partial', 'gap', 'unknown')),
  confidence REAL,
  notes TEXT,
  UNIQUE(procedure_match_id, requirement_id)
);

CREATE INDEX IF NOT EXISTS idx_requirement_matches_procedure_match_id
  ON requirement_matches(procedure_match_id);
CREATE INDEX IF NOT EXISTS idx_requirement_matches_capability_id
  ON requirement_matches(capability_id);
CREATE INDEX IF NOT EXISTS idx_requirement_matches_status ON requirement_matches(status);

-- ---------------------------------------------------------------------------
-- Offer preparation
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  procedure_id TEXT NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'ready', 'submitted', 'archived')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_offers_procedure_id ON offers(procedure_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

CREATE TABLE IF NOT EXISTS offer_items (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  requirement_id TEXT REFERENCES tender_requirements(id) ON DELETE SET NULL,
  capability_id TEXT REFERENCES capabilities(id) ON DELETE SET NULL,
  response_text TEXT,
  coverage_status TEXT NOT NULL DEFAULT 'gap'
    CHECK (coverage_status IN ('covered', 'partial', 'gap', 'n_a')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_offer_items_offer_id ON offer_items(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_items_requirement_id ON offer_items(requirement_id);
CREATE INDEX IF NOT EXISTS idx_offer_items_capability_id ON offer_items(capability_id);

-- ---------------------------------------------------------------------------
-- Seed known tender sources (from docs/tender-sources.md)
-- ---------------------------------------------------------------------------

INSERT OR IGNORE INTO sources (id, slug, name, base_url, access_method, refresh_interval_minutes) VALUES
  ('src-hlidac-statu', 'hlidac-statu', 'Hlídač Státu', 'https://www.hlidacstatu.cz', 'api', 60),
  ('src-ted', 'ted', 'TED (EU)', 'https://ted.europa.eu', 'api', 60),
  ('src-registr-smluv', 'registr-smluv', 'Registr smluv', 'https://smlouvy.gov.cz', 'dump', 1440),
  ('src-nen', 'nen', 'NEN', 'https://nen.nipez.cz', 'scrape', 30),
  ('src-vvz', 'vvz', 'Věstník veřejných zakázek', 'https://vvz.nipez.cz', 'scrape', 60),
  ('src-zakazky-gov', 'zakazky-gov', 'Zakázky GOV', 'https://zakazky.gov.cz', 'scrape', 30),
  ('src-ezak', 'ezak', 'E-ZAK', 'https://www.ezak.cz', 'rss', 30),
  ('src-tender-arena', 'tender-arena', 'Tender Arena', 'https://www.tenderarena.cz', 'rss', 30),
  ('src-josephine', 'josephine', 'Josephine / PROEBIZ', 'https://josephine.proebiz.com', 'scrape', 60),
  ('src-opentender', 'opentender', 'OpenTender (OCDS)', 'https://opentender.eu/cz', 'dump', 1440);
