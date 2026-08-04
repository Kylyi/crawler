# Czech Public Tender Data Sources (`české státní zakázky`)

This document provides a comprehensive research summary of all major Czech public procurement platforms, portals, and data aggregators. It details their description, technical accessibility, data formats, and recommended integration strategies (REST API vs. Web Crawling/Scraping), with a focus on IT public tenders.

---

## 1. Overview & Data Acquisition Strategies

In the Czech Republic, public tenders are governed by Act No. 134/2016 Coll. on Public Procurement (_Zákon o zadávání veřejných zakázek - ZZVZ_). Public authorities (_zadavatelé_) publish tenders either through state central platforms or certified electronic procurement tools (_elektronické nástroje_).

Data acquisition falls into four main technical categories:

1. **REST APIs & Structured JSON Interfaces**: Direct, real-time programmatic queries (e.g., Hlídač Státu, TED EU API).
2. **Open Data Dumps (XML/JSON/CSV)**: Bulk historical and periodic snapshots (e.g., Registr smluv, OpenTender).
3. **RSS / Atom Feeds**: Lightweight, real-time update polling supported natively by many procurement platforms (e.g., E-ZAK, Tender Arena).
4. **Web Crawling / HTML Scraping**: Automated extraction from public web portals without official APIs (e.g., NEN, VVZ, Zakázky GOV).

---

## 2. Source Breakdown

### A. Central State Platforms & Official Bulletins

#### 1. Zakázky GOV

- **URL**: [https://zakazky.gov.cz](https://zakazky.gov.cz)
- **Operator**: Ministry for Regional Development (MMR / NIPEZ)
- **Description**: Central public procurement portal launched to aggregate tenders from NEN, Tender Arena, TENDERMARKET, and the Central Register of Public Procurement.
- **Relevance to IT**: High. Serves as a unified entry point for tenders across state administration and local government.
- **Data Access Strategy**:
  - **Method**: Web Crawling / HTML Scraping & Internal API endpoints.
  - **Details**: The web interface dynamically presents aggregated data from NIPEZ-connected tools. Search queries can be executed over public list views or captured JSON endpoints used by the single-page application.
  - **Implementation**: See [zakazky-gov-api.md](./zakazky-gov-api.md) — `POST https://api.isd.nipez.cz/isd/seznam/zakazek/hlavni-seznam`
  - **Pros**: Broadest centralized coverage across multiple platforms.
  - **Cons**: Portal is in pilot/ongoing deployment; dynamic frontend rendering requires network request interception or DOM parsing.

#### 2. Věstník Veřejných Zakázek (VVZ)

- **URL**: [https://vvz.nipez.cz](https://vvz.nipez.cz)
- **Operator**: Ministry for Regional Development (MMR) / NIPEZ
- **Description**: Official national journal/bulletin where contracting authorities must legally publish form notices (announcements, tender calls, results, cancellations) for above-threshold and below-threshold contracts.
- **Relevance to IT**: Very High. All major state IT procurement notices pass through VVZ.
- **Data Access Strategy**:
  - **Method**: Web Scraping & Form Search Parsing.
  - **Details**: Search interface at `https://vvz.nipez.cz/vyhledat-formular` allows filtering by CPV, buyer, and publication date. Forms (e.g., F02, F03) follow standardized EU eForms structures.
  - **Pros**: Legally authoritative source for notice publications.
  - **Cons**: No public unrestricted REST API; requires HTML parsing or form search payload simulation.

#### 3. Národní Elektronický Nástroj (NEN)

- **URL**: [https://nen.nipez.cz](https://nen.nipez.cz)
- **Operator**: State-operated platform (MMR)
- **Description**: Mandatory e-procurement system for many central government ministries and state bodies to conduct procurement procedures from start to finish.
- **Relevance to IT**: Very High. Heavily used for ministry-level IT software development, infrastructure, and advisory contracts.
- **Data Access Strategy**:
  - **Method**: HTML Scraping / RSS / Public List Endpoint.
  - **Details**: The public list (`https://nen.nipez.cz/verejne-zakazky`) displays active and closed tender procedures. Filter parameters include CPV codes, procedure type, and submission deadline.
  - **Pros**: Direct access to primary tender documentation and submission requirements.
  - **Cons**: Anti-scraping rate limits may apply; session-based navigation on complex search pages.

#### 4. Registr Smluv (Register of Contracts)

- **URL**: [https://smlouvy.gov.cz](https://smlouvy.gov.cz) | Open Data: [https://data.smlouvy.gov.cz](https://data.smlouvy.gov.cz)
- **Operator**: Ministry of the Interior (MV ČR)
- **Description**: Central repository for all executed contracts above 50,000 CZK involving public funds.
- **Relevance to IT**: High for award analysis, vendor pricing, executed software licensing, and SLA monitoring.
- **Data Access Strategy**:
  - **Method**: Open Data Bulk Dumps (XML) & Open API.
  - **Details**: Monthly XML dumps (`dump_YYYY_MM.xml`) and index files (`index.xml`) are published under open data standards.
  - **Pros**: Completely open, standardized XML dumps with zero rate-limit friction for offline processing.
  - **Cons**: Reflects awarded/signed contracts rather than active tender calls.

---

### B. Certified Electronic Procurement Tools (_Profily Zadavatelů_)

State bodies, cities, regions, and universities frequently host procurement procedures on certified commercial e-procurement platforms.

#### 1. E-ZAK & Vhodné Uveřejnění

- **Provider**: QCM s.r.o.
- **Base URLs**: `https://www.ezak.cz`, `https://www.vhodne-uverejneni.cz`, and instance domains (e.g., `https://nen.profilyzadavatelu.cz`, `https://zakazky.spravazelenic.cz`, `https://zakazky.mzp.cz`).
- **Description**: The most widespread certified procurement tool in the Czech Republic, utilized by ministries (MV, MO, MD), state railways (Správa železnic), roads agency (ŘSD), regional authorities, and universities.
- **Relevance to IT**: Very High. A significant percentage of public IT infrastructure and custom development tenders are run on E-ZAK instances.
- **Data Access Strategy**:
  - **Method**: Native RSS/Atom Feeds & Standardized HTML Crawling.
  - **Details**: E-ZAK instances expose structured RSS feeds for new tenders (e.g., `/rss.php` or `/registrace-dodavatele/rss`). The HTML structure across different E-ZAK instances is highly consistent, making standard selectors reusable.
  - **Pros**: Predictable markup, native RSS feeds available per contracting authority profile.
  - **Cons**: Decentralized across hundreds of buyer profile subdomains.

#### 2. Tender Arena

- **Provider**: Tendersystems s.r.o.
- **URL**: [https://www.tenderarena.cz](https://www.tenderarena.cz)
- **Description**: Major electronic procurement platform used by statutory cities (e.g., Praha, Ostrava), regional health authorities, hospitals, and state-owned enterprises.
- **Relevance to IT**: High. Frequently used for municipal IT projects, hospital information systems (HIS), and local government digitalization.
- **Data Access Strategy**:
  - **Method**: RSS Feeds & Web Scraping.
  - **Details**: Public tender lists (`/dodavatel/seznam-profilu`) and tender search pages can be scraped or polled via RSS feeds provided on profile pages.
  - **Pros**: High concentration of municipal and healthcare IT procurement.
  - **Cons**: Dynamic JS navigation in certain views requires careful HTTP request inspection.

#### 3. Josephine & PROEBIZ

- **Provider**: NAR Marketing s.r.o. / Sentinet s.r.o.
- **URL**: [https://josephine.proebiz.com](https://josephine.proebiz.com) | [https://profily.proebiz.com](https://profily.proebiz.com)
- **Description**: E-procurement tool and buyer profile portal popular with municipal utilities and regional institutions.
- **Relevance to IT**: Medium. Handles specialized software tenders and regional utility IT procurement.
- **Data Access Strategy**:
  - **Method**: HTML Scraping / Public Listing.
  - **Details**: Scraping public listing tables filtered by procurement subject.
  - **Pros**: Simple web interface.
  - **Cons**: Lower overall volume of complex IT tenders compared to NEN or E-ZAK.

#### 4. E-Zakázky / Zadavatel.cz

- **Provider**: YOUR SYSTEM, spol. s r.o. / OTIDEA a.s.
- **URL**: [https://www.e-zakazky.cz](https://www.e-zakazky.cz) | [https://www.zadavatel.eu](https://www.zadavatel.eu)
- **Description**: Electronic tool used by various local municipalities and smaller public institutions.
- **Relevance to IT**: Medium to Low.
- **Data Access Strategy**:
  - **Method**: HTML Scraping / RSS.

---

### C. Open Data Aggregators & Third-Party APIs

#### 1. Hlídač Státu API

- **URL**: [https://www.hlidacstatu.cz/VerejneZakazky](https://www.hlidacstatu.cz/VerejneZakazky) | API Docs: [https://api.hlidacstatu.cz/swagger/index.html](https://api.hlidacstatu.cz/swagger/index.html)
- **Operator**: Hlídač Státu z.s. (NGO)
- **Description**: Premier Czech transparency aggregator that normalizes tenders, contracts, and subsidies from VVZ, NEN, and Registr Smluv into a unified database.
- **Relevance to IT**: Exceptional. Hlídač Státu has dedicated IT procurement monitoring filters and maintains explicit ICT cost analysis models.
- **Data Access Strategy**:
  - **Method**: Official REST API v2.
  - **Endpoint**: `GET /api/v2/datasety/{datasetId}/hledat`
  - **Auth**: API Token header (`Authorization: Token <API_TOKEN>`).
  - **Query Examples**:
    - Search IT tenders: `Q=cpv:72000000-5` or `Q=obor:IT`
  - **Pros**: Cleanest pre-parsed data in JSON format; combines tenders with contracting authority metadata.
  - **Cons**: Rate limits based on API tier; requires account token registration.

#### 2. TED (Tenders Electronic Daily) - EU Public Procurement API

- **URL**: [https://ted.europa.eu](https://ted.europa.eu) | API Docs: [https://docs.ted.europa.eu/api/latest/index.html](https://docs.ted.europa.eu/api/latest/index.html)
- **Operator**: Publications Office of the European Union
- **Description**: Official EU journal for all above-threshold public procurement across EU member states, including Czechia (threshold approx. > 5.3M CZK for supplies/services).
- **Relevance to IT**: Very High for high-value state IT systems, major software development, and cloud framework agreements.
- **Data Access Strategy**:
  - **Method**: Official REST API v3.
  - **Endpoint**: `POST https://api.ted.europa.eu/v3/notices/search`
  - **Query Example**:
    ```json
    {
      "q": "ND = [CZ] AND PC = [72000000]",
      "fields": [
        "publication-number",
        "title-cz",
        "deadline-receipt-requests",
        "buyer-name-official"
      ]
    }
    ```
  - **Pros**: Free, reliable REST API, rich XML/JSON payloads, standardized CPV coding.
  - **Cons**: Only covers above-threshold contracts; does not include small-scale regional tenders (_zakázky malého rozsahu_).

#### 3. OpenTender / OCDS Czech Republic Data

- **URL**: [https://opentender.eu/cz](https://opentender.eu/cz) | Data Registry: [https://data.open-contracting.org/en/publication/12](https://data.open-contracting.org/en/publication/12)
- **Operator**: Government Transparency Institute
- **Description**: Standardized Open Contracting Data Standard (OCDS) datasets combining TED and national VVZ records for the Czech Republic.
- **Relevance to IT**: High for batch training, historical analytics, and cross-checking.
- **Data Access Strategy**:
  - **Method**: Bulk JSONL / CSV Downloads.
  - **Pros**: Fully compliant with OCDS schema.
  - **Cons**: Updated periodically (not suitable for sub-minute real-time alert systems).

---

## 3. IT Focus & CPV Code Taxonomy

To filter retrieved tenders specifically for the IT sector, the crawler must match against the **Common Procurement Vocabulary (CPV)** tree and Czech IT keywords.

### A. Primary IT CPV Codes

| CPV Code       | Czech Description                                                 | English Description                                                 |
| -------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| **72000000-5** | Informační technologie: poradenství, vývoj SW, internet a podpora | IT services: consulting, software development, Internet and support |
| **72200000-7** | Vývoj programového vybavení a poradenské služby                   | Software programming and consultancy services                       |
| **72230000-6** | Vývoj programového vybavení na zakázku                            | Custom software development services                                |
| **72260000-5** | Služby programového vybavení                                      | Software-related services                                           |
| **72212000-4** | Služby vývoje programového vybavení pro aplikovaný software       | Application software development services                           |
| **72600000-6** | Počítačové podpůrné a poradenské služby                           | Computer support and consultancy services                           |
| **48000000-8** | Balíky programů a informační systémy                              | Software package and information systems                            |
| **30200000-1** | Počítačová zařízení a vybavení                                    | Computer equipment and supplies                                     |
| **50300000-8** | Opravy a údržba počítačových zařízení                             | Repair and maintenance services of computer equipment               |

### B. Core Czech IT Search Keywords

- `informační systém` / `IS`
- `vývoj software` / `vývoj aplikací`
- `cloud` / `hosting` / `datacenter`
- `kybernetická bezpečnost` / `databáze`
- `IT infrastruktura` / `hw a sw`
- `SLA` / `podpora provozu`
- `licence` / `subskripce`

---

## 4. Recommended Technical Architecture Matrix

| Source               | Preferred Strategy                   | Refresh Interval | Coverage Scope               | Complexity |
| -------------------- | ------------------------------------ | ---------------- | ---------------------------- | ---------- |
| **Hlídač Státu API** | REST API (`/api/v2/...`)             | Hourly           | Aggregated National          | Low        |
| **TED EU API**       | REST API (`POST /v3/notices/search`) | Hourly           | Above-threshold National     | Low        |
| **Registr Smluv**    | XML Monthly Dumps                    | Daily / Monthly  | Signed Contracts             | Low        |
| **E-ZAK Profiles**   | RSS Feeds + HTML Scraping            | 15–30 Mins       | Ministries, Regions, Uni     | Medium     |
| **NEN Portal**       | HTML / HTTP Request Crawling         | 30 Mins          | State Ministries & Agencies  | Medium     |
| **Tender Arena**     | RSS Feeds + HTML Scraping            | 30 Mins          | Cities, Hospitals, Utilities | Medium     |
| **VVZ Bulletin**     | Search Form Request Scraping         | 1 Hour           | National Official Bulletin   | High       |
