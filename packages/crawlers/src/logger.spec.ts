import { createConsola } from 'consola'
import { describe, expect, it } from 'vite-plus/test'
import { createCrawlLogger, formatDuration } from './logger'

function createCapturingLogger() {
  const calls: Array<{ type: string; tag?: string; args: unknown[] }> = []
  const consola = createConsola({
    level: 5,
    reporters: [
      {
        log(logObj) {
          calls.push({ type: logObj.type, tag: logObj.tag, args: logObj.args })
        },
      },
    ],
  })
  return { calls, consola }
}

describe('formatDuration', () => {
  it('formats milliseconds, seconds, and minutes', () => {
    expect(formatDuration(250)).toBe('250ms')
    expect(formatDuration(1500)).toBe('1.5s')
    expect(formatDuration(12_000)).toBe('12s')
    expect(formatDuration(125_000)).toBe('2m 5s')
  })
})

describe('createCrawlLogger', () => {
  it('tags messages and presents metadata', () => {
    const { calls, consola } = createCapturingLogger()
    const log = createCrawlLogger('zakazky-gov', { consola })

    log.start('list crawl', { runId: 'abc', pageSize: 50, durationMs: 1500 })

    expect(calls).toHaveLength(1)
    expect(calls[0]?.type).toBe('start')
    expect(calls[0]?.tag).toContain('crawl:zakazky-gov')
    expect(calls[0]?.args[0]).toBe('list crawl')
    expect(calls[0]?.args[1]).toEqual({
      runId: 'abc',
      pageSize: 50,
      duration: '1.5s',
    })
  })

  it('maps finish to success or fail by message', () => {
    const { calls, consola } = createCapturingLogger()
    const log = createCrawlLogger('zakazky-gov', { consola })

    log.finish('list crawl succeeded', { tendersFound: 3 })
    log.finish('detail crawl completed with errors', { failed: 2 })

    expect(calls.map((c) => c.type)).toEqual(['success', 'fail'])
  })

  it('adds progress fraction from index/total', () => {
    const { calls, consola } = createCapturingLogger()
    const log = createCrawlLogger('zakazky-gov:detail', { consola })

    log.progress('enriched tender', { externalId: 'RVZ1', index: 3, total: 50 })

    expect(calls[0]?.type).toBe('log')
    expect(calls[0]?.args[1]).toMatchObject({
      externalId: 'RVZ1',
      progress: '3/50',
    })
  })

  it('writes warn and error levels', () => {
    const { calls, consola } = createCapturingLogger()
    const log = createCrawlLogger('zakazky-gov', { consola })

    log.warn('slow')
    log.error('boom', { code: 429 })

    expect(calls.map((c) => c.type)).toEqual(['warn', 'error'])
    expect(calls[1]?.args[1]).toEqual({ code: 429 })
  })
})
