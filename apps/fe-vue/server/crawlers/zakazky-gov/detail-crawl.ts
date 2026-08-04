import {
  enrichTender,
  finishCrawlRun,
  getSourceBySlug,
  getTendersNeedingDetail,
  markDetailFetched,
  replaceTenderDocuments,
  startCrawlRun,
} from "../db";
import { createCrawlLogger } from "../logger";
import type { CrawlResult } from "../types";
import { sleep } from "../utils";
import { resolveConfig, SOURCE_SLUG } from "./config";
import { fetchDetail } from "./detail-client";
import { mapDetailToPatch } from "./detail-mapper";

const log = createCrawlLogger("zakazky-gov:detail");

export type DetailCrawlOptions = {
  limit?: number;
};

export async function runZakazkyGovDetailCrawl(
  options: DetailCrawlOptions = {},
): Promise<CrawlResult> {
  const startedAt = Date.now();
  const source = await getSourceBySlug(SOURCE_SLUG);
  const config = resolveConfig(source);
  const runId = await startCrawlRun(SOURCE_SLUG);

  const limit = options.limit ?? config.detailMaxPerRun;
  const queue = await getTendersNeedingDetail(SOURCE_SLUG, limit);

  log.start("detail crawl", {
    runId,
    limit,
    queued: queue.length,
    delayMs: config.detailRequestDelayMs,
  });

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let consecutiveRateLimits = 0;
  const errors: string[] = [];

  try {
    for (const [index, tender] of queue.entries()) {
      try {
        const detail = await fetchDetail(tender.externalId, config);

        if (!detail) {
          skipped++;
          log.warn("detail not found, skipping", {
            externalId: tender.externalId,
            index: index + 1,
            total: queue.length,
          });
          continue;
        }

        const patch = mapDetailToPatch(detail, config.portalBaseUrl);
        await enrichTender(SOURCE_SLUG, tender.externalId, patch);

        if (patch.documents?.length) {
          await replaceTenderDocuments(tender.id, patch.documents);
        }

        await markDetailFetched(SOURCE_SLUG, tender.externalId);
        processed++;
        consecutiveRateLimits = 0;

        log.progress("enriched tender", {
          externalId: tender.externalId,
          index: index + 1,
          total: queue.length,
          cpvCodes: patch.cpvCodes?.length ?? 0,
          documents: patch.documents?.length ?? 0,
          categories: patch.categories?.join(",") || "-",
        });

        if (config.detailRequestDelayMs > 0) {
          await sleep(config.detailRequestDelayMs);
        }
      } catch (error) {
        failed++;
        const message = error instanceof Error ? error.message : String(error);
        errors.push(`${tender.externalId}: ${message}`);
        log.error("failed to enrich tender", {
          externalId: tender.externalId,
          index: index + 1,
          total: queue.length,
          error: message,
        });

        if (message.includes("429")) {
          consecutiveRateLimits++;
          const pauseMs = Math.min(180_000, 30_000 * consecutiveRateLimits);
          log.warn("rate limited, cooling down", {
            pauseMs,
            consecutiveRateLimits,
          });
          await sleep(pauseMs);
        } else {
          consecutiveRateLimits = 0;
        }
      }
    }

    const durationMs = Date.now() - startedAt;
    const status = errors.length > 0 && processed === 0 ? "failed" : "success";
    const errorMessage = errors.length > 0 ? errors.slice(0, 10).join("; ") : undefined;

    await finishCrawlRun(runId, {
      status,
      tendersFound: processed,
      errorMessage,
    });

    log.finish(
      status === "success" ? "detail crawl succeeded" : "detail crawl completed with errors",
      {
        runId,
        processed,
        skipped,
        failed,
        queued: queue.length,
        durationMs,
      },
    );

    return {
      runId,
      source: SOURCE_SLUG,
      tendersFound: processed,
      pagesFetched: 0,
      durationMs,
      status,
      error: errorMessage,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const durationMs = Date.now() - startedAt;

    await finishCrawlRun(runId, {
      status: "failed",
      tendersFound: processed,
      errorMessage: message,
    });

    log.error("detail crawl failed", {
      runId,
      processed,
      skipped,
      failed,
      durationMs,
      error: message,
    });

    return {
      runId,
      source: SOURCE_SLUG,
      tendersFound: processed,
      pagesFetched: 0,
      durationMs,
      status: "failed",
      error: message,
    };
  }
}
