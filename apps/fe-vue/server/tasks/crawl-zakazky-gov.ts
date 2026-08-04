import { defineTask } from "nitro/task";
import { runZakazkyGovCrawl } from "../crawlers/zakazky-gov/crawl";

export default defineTask({
  meta: {
    name: "crawl-zakazky-gov",
    description: "Crawl active tenders from Zakázky GOV",
  },
  async run() {
    const result = await runZakazkyGovCrawl();
    console.info("[crawl:zakazky-gov]", JSON.stringify(result));
    return { result: result.status, ...result };
  },
});
