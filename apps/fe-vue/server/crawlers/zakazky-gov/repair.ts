import { useDatabase } from "nitro/database";
import { enrichTender, getSourceBySlug, replaceTenderDocuments } from "../db";
import { createCrawlLogger } from "../logger";
import { parseJson } from "../utils";
import { resolveConfig, SOURCE_SLUG } from "./config";
import { mapDetailToPatch } from "./detail-mapper";
import type { ZakazkyGovDetailResponse } from "./types";

const log = createCrawlLogger("zakazky-gov:repair");

export type RepairResult = {
  scanned: number;
  repaired: number;
  skipped: number;
};

/** Re-apply detail mapper from stored raw_data.detail (no API calls). */
export async function repairEnrichedFieldsFromStoredDetail(): Promise<RepairResult> {
  const db = useDatabase();
  const source = await getSourceBySlug(SOURCE_SLUG);
  const config = resolveConfig(source);

  const { rows } = await db.sql`
    SELECT id, external_id, raw_data
    FROM tenders
    WHERE source = ${SOURCE_SLUG}
      AND detail_fetched_at IS NOT NULL
      AND (cpv_codes IS NULL OR cpv_codes = '[]' OR cpv_codes = '')
  `;

  const candidates = rows ?? [];

  log.start("repair from stored detail", { candidates: candidates.length });

  let repaired = 0;
  let skipped = 0;

  for (const row of candidates) {
    const typed = row as { id: string; external_id: string; raw_data: string | null };
    const raw = parseJson<{ detail?: ZakazkyGovDetailResponse }>(typed.raw_data, {});
    if (!raw.detail) {
      skipped++;
      continue;
    }

    const patch = mapDetailToPatch(raw.detail, config.portalBaseUrl);
    await enrichTender(SOURCE_SLUG, typed.external_id, patch);

    if (patch.documents?.length) {
      await replaceTenderDocuments(typed.id, patch.documents);
    }

    repaired++;
  }

  log.finish("repair complete", { scanned: candidates.length, repaired, skipped });

  return { scanned: candidates.length, repaired, skipped };
}
