import { defineTask } from "nitro/task";
import { runZakazkyGovDetailCrawl } from "../crawlers/zakazky-gov/detail-crawl";

export default defineTask({
  meta: {
    name: "crawl-zakazky-gov-detail",
    description: "Fetch tender details from Zakázky GOV detail API",
  },
  async run() {
    const result = await runZakazkyGovDetailCrawl();
    console.info("[crawl:zakazky-gov:detail]", JSON.stringify(result));
    return { result: result.status, ...result };
  },
});
