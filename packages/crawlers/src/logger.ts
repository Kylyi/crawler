import { createConsola, LogLevels } from 'consola'
import type { ConsolaInstance } from 'consola'

export type LogMeta = Record<string, unknown>

export type CrawlLogger = {
  start: (message: string, meta?: LogMeta) => void
  info: (message: string, meta?: LogMeta) => void
  progress: (message: string, meta?: LogMeta) => void
  warn: (message: string, meta?: LogMeta) => void
  error: (message: string, meta?: LogMeta) => void
  finish: (message: string, meta?: LogMeta) => void
}

export type CreateCrawlLoggerOptions = {
  /** Override log level (defaults to CRAWL_LOG_LEVEL / LOG_LEVEL / info). */
  level?: number
  /** Inject a consola instance (useful in tests). */
  consola?: ConsolaInstance
}

function readEnv(name: string): string | undefined {
  try {
    return typeof process !== 'undefined' ? process.env[name] : undefined
  } catch {
    return undefined
  }
}

function resolveLevel(override?: number): number {
  if (typeof override === 'number') {
    return override
  }

  const raw = readEnv('CRAWL_LOG_LEVEL') ?? readEnv('LOG_LEVEL')
  if (!raw) {
    return LogLevels.info
  }

  const named = LogLevels[raw.toLowerCase() as keyof typeof LogLevels]
  if (typeof named === 'number') {
    return named
  }

  const numeric = Number(raw)

  return Number.isFinite(numeric) ? numeric : LogLevels.info
}

/** Human-readable duration for log output. */
export function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) {
    return String(ms)
  }
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  }
  if (ms < 60_000) {
    const seconds = ms / 1000

    return `${seconds < 10 ? seconds.toFixed(1) : Math.round(seconds)}s`
  }
  const minutes = Math.floor(ms / 60_000)
  const seconds = Math.round((ms % 60_000) / 1000)

  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`
}

function presentMeta(meta?: LogMeta): LogMeta | undefined {
  if (!meta) {
    return undefined
  }

  const out: LogMeta = {}

  for (const [key, value] of Object.entries(meta)) {
    if (typeof value === 'number' && key.endsWith('Ms')) {
      out[key.slice(0, -2)] = formatDuration(value)
      continue
    }
    out[key] = value
  }

  if (typeof out.index === 'number' && typeof out.total === 'number' && out.total > 0 && out.progress === undefined) {
    out.progress = `${out.index}/${out.total}`
  }

  return out
}

function emit(logger: ConsolaInstance, type: 'start' | 'info' | 'log' | 'warn' | 'error' | 'success' | 'fail') {
  return (message: string, meta?: LogMeta) => {
    const presented = presentMeta(meta)
    if (presented && Object.keys(presented).length > 0) {
      logger[type](message, presented)
    } else {
      logger[type](message)
    }
  }
}

export function createCrawlLogger(scope: string, options: CreateCrawlLoggerOptions = {}): CrawlLogger {
  const base =
    options.consola ??
    createConsola({
      level: resolveLevel(options.level),
      formatOptions: {
        colors: true,
        compact: true,
        date: true,
      },
    })

  const logger = base.withTag(`crawl:${scope}`)

  return {
    start: emit(logger, 'start'),
    info: emit(logger, 'info'),
    progress: emit(logger, 'log'),
    warn: emit(logger, 'warn'),
    error: emit(logger, 'error'),
    finish: (message, meta) => {
      const failed = /\b(?:fail|failed|error|errors)\b/i.test(message)
      emit(logger, failed ? 'fail' : 'success')(message, meta)
    },
  }
}
