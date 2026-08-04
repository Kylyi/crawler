-- Portal category tags (e.g. ItSluzby) and normalized sectors (e.g. IT)
ALTER TABLE tenders ADD COLUMN tags TEXT;
ALTER TABLE tenders ADD COLUMN categories TEXT;

CREATE INDEX IF NOT EXISTS idx_tenders_categories ON tenders(categories);
