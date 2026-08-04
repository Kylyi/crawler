import { describe, expect, it } from "vite-plus/test";
import { shouldContinuePagination } from "./client";
import type { ZakazkyGovListResponse } from "./types";

describe("shouldContinuePagination", () => {
  const response: ZakazkyGovListResponse = {
    polozky: [
      { identifikator_NIPEZ: "RVZ1", nazev_verejne_zakazky: "A", stav: "AKTIVNI_NEUKONCEN" },
    ],
    posledni_stranka: false,
  };

  it("continues when more pages exist", () => {
    expect(shouldContinuePagination(response, 1, 10)).toBe(true);
  });

  it("stops at max pages", () => {
    expect(shouldContinuePagination(response, 10, 10)).toBe(false);
  });

  it("stops on last page flag", () => {
    expect(shouldContinuePagination({ ...response, posledni_stranka: true }, 1, 10)).toBe(false);
  });

  it("stops on empty results", () => {
    expect(shouldContinuePagination({ polozky: [], posledni_stranka: false }, 1, 10)).toBe(false);
  });
});
