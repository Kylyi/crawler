export function createId(): string {
  return crypto.randomUUID()
}

export function toJson(value: unknown): string {
  return JSON.stringify(value)
}

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback
  }
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export type TenderRawData = {
  list?: unknown
  detail?: unknown
}

/** Normalize stored raw_data to { list, detail } shape */
export function parseRawData(value: unknown): TenderRawData {
  if (!value || typeof value !== 'object') {
    return value === undefined || value === null ? {} : { list: value }
  }

  const record = value as Record<string, unknown>
  if ('list' in record || 'detail' in record) {
    return {
      list: record.list,
      detail: record.detail,
    }
  }

  return { list: value }
}

export function mergeRawData(existing: unknown, update: Partial<TenderRawData>): TenderRawData {
  const base = parseRawData(existing)

  return {
    list: update.list !== undefined ? update.list : base.list,
    detail: update.detail !== undefined ? update.detail : base.detail,
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function mapApiStatus(stav: string): string {
  switch (stav) {
    case 'AKTIVNI_NEUKONCEN':
      return 'active'
    case 'DOKONCEN_ZADAN':
      return 'completed'
    default:
      return stav.toLowerCase()
  }
}
