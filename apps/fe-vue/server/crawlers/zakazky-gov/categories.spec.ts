import { describe, expect, it } from "vite-plus/test";
import {
  deriveCategoriesFromCpv,
  deriveCategoriesFromTags,
  mergeCategories,
  normalizeCpvCode,
  normalizePortalTags,
} from "./categories";

describe("normalizePortalTags", () => {
  it("strips hash prefix from portal stitky", () => {
    expect(normalizePortalTags(["#ItSluzby", "#Software"])).toEqual(["ItSluzby", "Software"]);
  });
});

describe("deriveCategoriesFromTags", () => {
  it("maps IT portal tags to IT category", () => {
    expect(deriveCategoriesFromTags(["ItSluzby", "Software"])).toEqual(["IT"]);
  });

  it("returns empty array when no tags", () => {
    expect(deriveCategoriesFromTags([])).toEqual([]);
  });
});

describe("normalizeCpvCode", () => {
  it("appends check digit suffix to 8-digit codes", () => {
    expect(normalizeCpvCode("72000000")).toBe("72000000-5");
  });

  it("preserves codes that already include suffix", () => {
    expect(normalizeCpvCode("72200000-7")).toBe("72200000-7");
  });
});

describe("deriveCategoriesFromCpv", () => {
  it("maps CPV division 72 to IT category", () => {
    expect(deriveCategoriesFromCpv(["72000000"])).toEqual(["IT"]);
  });
});

describe("mergeCategories", () => {
  it("merges and deduplicates category sets", () => {
    expect(mergeCategories(["IT"], ["Services", "IT"])).toEqual(["IT", "Services"]);
  });
});
