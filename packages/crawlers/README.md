# crawlers

Pure TypeScript tender crawlers with no Nuxt/Nitro bindings.

Persistence goes through the `CrawlStore` port — apps inject their own adapter
(e.g. Nitro D1 in `fe-vue`).

```ts
import { runZakazkyGovCrawl } from 'crawlers'
import type { CrawlStore } from 'crawlers'

await runZakazkyGovCrawl(store)
```
