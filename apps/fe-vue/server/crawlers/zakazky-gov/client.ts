import { ofetch } from "ofetch";
import { sleep } from "../utils";
import type { ZakazkyGovConfig, ZakazkyGovListRequest, ZakazkyGovListResponse } from "./types";

const USER_AGENT = "Crawler/fe-vue (+https://zakazky.gov.cz)";

export type FetchPageResult = {
  page: number;
  items: ZakazkyGovListResponse;
};

export async function fetchListPage(
  config: ZakazkyGovConfig,
  page: number,
): Promise<ZakazkyGovListResponse> {
  const body: ZakazkyGovListRequest = {
    filtr: { skupinaZakazek: config.skupinaZakazek },
    strankovani: { stranka: page, pocet_zaznamu: config.pageSize },
    razeni: {
      atribut: config.sortAttribute,
      typ_razeni: config.sortDirection,
    },
  };

  return ofetch<ZakazkyGovListResponse>(config.apiUrl, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    },
  });
}

export async function fetchAllPages(
  config: ZakazkyGovConfig,
  onPage?: (result: FetchPageResult, totals: { pages: number; items: number }) => void,
): Promise<FetchPageResult[]> {
  const pages: FetchPageResult[] = [];
  let totalItems = 0;

  for (let page = 1; page <= config.maxPages; page++) {
    const items = await fetchListPage(config, page);
    totalItems += items.polozky.length;
    const result = { page, items };
    pages.push(result);
    onPage?.(result, { pages: pages.length, items: totalItems });

    if (items.posledni_stranka || items.polozky.length === 0) {
      break;
    }

    if (page < config.maxPages && config.requestDelayMs > 0) {
      await sleep(config.requestDelayMs);
    }
  }

  return pages;
}

export function shouldContinuePagination(
  response: ZakazkyGovListResponse,
  currentPage: number,
  maxPages: number,
): boolean {
  if (currentPage >= maxPages) return false;
  if (response.posledni_stranka) return false;
  if (response.polozky.length === 0) return false;
  return true;
}
