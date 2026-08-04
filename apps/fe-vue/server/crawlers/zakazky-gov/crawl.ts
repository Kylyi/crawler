import { finishCrawlRun, getSourceBySlug, startCrawlRun, upsertTender } from "../db";
import { createCrawlLogger } from "../logger";
import type { CrawlResult } from "../types";
import { resolveConfig, SOURCE_SLUG } from "./config";
import { fetchAllPages } from "./client";
import { mapListResponseToTenders } from "./mapper";

const log = createCrawlLogger("zakazky-gov");

export async function runZakazkyGovCrawl(): Promise<CrawlResult> {
  const startedAt = Date.now();
  const source = await getSourceBySlug(SOURCE_SLUG);
  const config = resolveConfig(source);
  const runId = await startCrawlRun(SOURCE_SLUG);

  log.start("list crawl", {
    runId,
    skupinaZakazek: config.skupinaZakazek,
    pageSize: config.pageSize,
    maxPages: config.maxPages,
  });

  let tendersFound = 0;
  let pagesFetched = 0;

  try {
    const pages = await fetchAllPages(config, ({ page, items }, totals) => {
      log.progress("fetched list page", {
        page,
        pageItems: items.polozky.length,
        totalPages: totals.pages,
        totalItems: totals.items,
        lastPage: items.posledni_stranka,
      });
    });
    pagesFetched = pages.length;

    log.info("upserting tenders", { pages: pagesFetched });

    for (const { page, items } of pages) {
      const tenders = mapListResponseToTenders(items.polozky, config.portalBaseUrl);

      for (const tender of tenders) {
        await upsertTender(SOURCE_SLUG, tender);
        tendersFound++;
      }

      log.progress("stored list page", {
        page,
        pageTenders: tenders.length,
        totalTenders: tendersFound,
      });
    }

    const durationMs = Date.now() - startedAt;

    await finishCrawlRun(runId, {
      status: "success",
      tendersFound,
    });

    log.finish("list crawl succeeded", {
      runId,
      tendersFound,
      pagesFetched,
      durationMs,
    });

    return {
      runId,
      source: SOURCE_SLUG,
      tendersFound,
      pagesFetched,
      durationMs,
      status: "success",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const durationMs = Date.now() - startedAt;

    await finishCrawlRun(runId, {
      status: "failed",
      tendersFound,
      errorMessage: message,
    });

    log.error("list crawl failed", {
      runId,
      tendersFound,
      pagesFetched,
      durationMs,
      error: message,
    });

    return {
      runId,
      source: SOURCE_SLUG,
      tendersFound,
      pagesFetched,
      durationMs,
      status: "failed",
      error: message,
    };
  }
}
