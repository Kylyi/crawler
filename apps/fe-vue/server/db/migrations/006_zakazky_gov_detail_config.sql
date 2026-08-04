-- Extend Zakázky GOV source config with detail crawl settings
UPDATE sources
SET config = '{"apiUrl":"https://api.isd.nipez.cz/isd/seznam/zakazek/hlavni-seznam","portalBaseUrl":"https://zakazky.gov.cz","skupinaZakazek":"AKTIVNI","pageSize":50,"maxPages":100,"requestDelayMs":500,"sortAttribute":"DATUM_UVEREJNENI_NA_ZAKAZKY_GOV","sortDirection":"SESTUPNE","detailApiUrl":"https://api.isd.nipez.cz/isd/detail/zakazky/verejna-zakazka","detailBatchSize":100,"detailRequestDelayMs":300,"detailMaxPerRun":200}',
    updated_at = datetime('now')
WHERE slug = 'zakazky-gov';
