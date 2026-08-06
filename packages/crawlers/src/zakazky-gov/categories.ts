/** Portal tag (stitky without #) → high-level sector labels */
const TAG_TO_CATEGORIES: Record<string, string[]> = {
  ItSluzby: ['IT'],
  Software: ['IT'],
  HwAPrislusenstvi: ['IT'],
  Telekomunikace: ['IT'],
  Energetika: ['Energy'],
  ArchitektonickeAProjekcniSluzby: ['Construction', 'Services'],
  StavebniPrace: ['Construction'],
  ZdravotnickyMaterial: ['Healthcare'],
  DopravaALogistika: ['Transport'],
  Vozidla: ['Transport'],
  OdborneSluzby: ['Services'],
  VzdelavaniASkoleni: ['Education'],
  VedaVyzkumALaboratore: ['Research'],
  PohonneHmoty: ['Energy'],
  DrogerieAChemie: ['Chemicals'],
}

export function normalizePortalTags(stitky?: string[]): string[] {
  if (!stitky?.length) {
    return []
  }

  return stitky.map(tag => tag.replace(/^#/, ''))
}

export function deriveCategoriesFromTags(tags: string[]): string[] {
  const categories = new Set<string>()

  for (const tag of tags) {
    for (const category of TAG_TO_CATEGORIES[tag] ?? []) {
      categories.add(category)
    }
  }

  return [...categories].sort()
}

/** IT CPV division 72 — see docs/tender-sources.md */
const IT_CPV_PREFIXES = ['72']

export function normalizeCpvCode(code: string): string {
  const trimmed = code.trim()
  if (/^\d{8}-\d$/.test(trimmed)) {
    return trimmed
  }
  if (/^\d{8}$/.test(trimmed)) {
    return `${trimmed}-5`
  }

  return trimmed
}

export function deriveCategoriesFromCpv(cpvCodes: string[]): string[] {
  const categories = new Set<string>()

  for (const code of cpvCodes) {
    const normalized = normalizeCpvCode(code)
    const prefix = normalized.slice(0, 2)
    if (IT_CPV_PREFIXES.includes(prefix)) {
      categories.add('IT')
    }
  }

  return [...categories].sort()
}

export function mergeCategories(...sets: string[][]): string[] {
  const categories = new Set<string>()
  for (const set of sets) {
    for (const category of set) {
      categories.add(category)
    }
  }

  return [...categories].sort()
}
