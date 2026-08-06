import process from 'node:process'
import { createCrawlLogger } from 'crawlers'
import { textOrCancel } from '../../../scripts/_lib/prompt.ts'
import { flagString, parseFlags } from '../../../scripts/_lib/run.ts'
import type { ScriptContext } from '../../../scripts/_lib/types.ts'

export { flagString, parseFlags }

const log = createCrawlLogger('client')

export async function resolveBaseUrl(ctx: ScriptContext): Promise<string> {
  const flags = parseFlags(ctx.argv)
  const fromFlag = flagString(flags, 'base-url')
  if (fromFlag) {
    return fromFlag.replace(/\/$/, '')
  }

  const fromEnv = process.env.CRAWL_BASE_URL
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }

  if (ctx.interactive) {
    const value = await textOrCancel('Base URL', {
      defaultValue: 'http://localhost:3000',
    })
    if (!value) {
      throw new Error('Cancelled.')
    }

    return value.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}

export async function resolveLimit(ctx: ScriptContext, defaultLimit = 50): Promise<number> {
  const flags = parseFlags(ctx.argv)
  const fromFlag = flagString(flags, 'limit')
  if (fromFlag) {
    const n = Number(fromFlag)
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error(`Invalid --limit=${fromFlag}`)
    }

    return n
  }

  if (ctx.interactive) {
    const value = await textOrCancel('Limit', { defaultValue: String(defaultLimit) })
    if (!value) {
      throw new Error('Cancelled.')
    }
    const n = Number(value)
    if (!Number.isFinite(n) || n <= 0) {
      throw new Error(`Invalid limit: ${value}`)
    }

    return n
  }

  return defaultLimit
}

export async function postCrawl(url: string): Promise<unknown> {
  log.start('POST crawl endpoint', { url })

  const res = await fetch(url, { method: 'POST' })
  const text = await res.text()
  let body: unknown = text
  try {
    body = JSON.parse(text) as unknown
  } catch {
    // keep text
  }

  if (!res.ok) {
    log.error('crawl request failed', { url, status: res.status, body: text.slice(0, 500) })
    throw new Error(`POST ${url} failed (${res.status}): ${text}`)
  }

  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>
    log.finish(record.status === 'failed' ? 'crawl request failed' : 'crawl request succeeded', {
      status: record.status,
      tendersFound: record.tendersFound,
      pagesFetched: record.pagesFetched,
      durationMs: record.durationMs,
      error: record.error,
    })
  } else {
    log.finish('crawl request succeeded', { body: String(body).slice(0, 200) })
  }

  return body
}
