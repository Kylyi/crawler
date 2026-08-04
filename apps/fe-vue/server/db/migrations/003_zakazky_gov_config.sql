-- Seed default crawler config for Zakázky GOV
UPDATE sources
SET config = '{"apiUrl":"https://api.isd.nipez.cz/isd/seznam/zakazek/hlavni-seznam","portalBaseUrl":"https://zakazky.gov.cz","skupinaZakazek":"AKTIVNI","pageSize":50,"maxPages":100,"requestDelayMs":500,"sortAttribute":"DATUM_UVEREJNENI_NA_ZAKAZKY_GOV","sortDirection":"SESTUPNE"}',
    updated_at = datetime('now')
WHERE slug = 'zakazky-gov';
