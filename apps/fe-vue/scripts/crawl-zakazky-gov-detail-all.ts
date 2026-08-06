import type { Buffer } from 'node:buffer'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import process from 'node:process'
import * as p from '@clack/prompts'
import type { Script } from '../../../scripts/_lib/types.ts'
import { textOrCancel } from '../../../scripts/_lib/prompt.ts'
import { flagString, parseFlags, sleep } from '../../../scripts/_lib/run.ts'
import { postCrawl, resolveBaseUrl } from './_shared.ts'

function sqliteScalar(dbPath: string, sql: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('sqlite3', [dbPath, sql], { stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString()
    })
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString()
    })
    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) {
        resolve(stdout.trim())

        return
      }
      reject(new Error(stderr || `sqlite3 exited with code ${code ?? 'unknown'}`))
    })
  })
}

function sqliteExec(dbPath: string, sql: string): Promise<string> {
  return sqliteScalar(dbPath, sql)
}

async function resolveNumber(
  ctx: { interactive: boolean, argv: string[] },
  flag: string,
  message: string,
  defaultValue: number,
  envName: string,
): Promise<number> {
  const flags = parseFlags(ctx.argv)
  const fromFlag = flagString(flags, flag)
  if (fromFlag) {
    const n = Number(fromFlag)
    if (!Number.isFinite(n) || n < 0) {
      throw new Error(`Invalid --${flag}=${fromFlag}`)
    }

    return n
  }

  const fromEnv = process.env[envName]
  if (fromEnv) {
    const n = Number(fromEnv)
    if (Number.isFinite(n) && n >= 0) {
      return n
    }
  }

  if (ctx.interactive) {
    const value = await textOrCancel(message, { defaultValue: String(defaultValue) })
    if (!value) {
      throw new Error('Cancelled.')
    }
    const n = Number(value)
    if (!Number.isFinite(n) || n < 0) {
      throw new Error(`Invalid value: ${value}`)
    }

    return n
  }

  return defaultValue
}

export default {
  id: 'crawl:zakazky-gov:detail:all',
  label: 'Crawl zakazky-gov detail (all)',
  group: 'Crawl',
  hint: 'Loops until all tenders have detail',
  async run(ctx) {
    if (!ctx.appDir) {
      throw new Error('Expected appDir for fe-vue script')
    }

    const base = await resolveBaseUrl(ctx)
    const db = join(ctx.appDir, '.data/dev-db.sqlite')
    const batch = await resolveNumber(ctx, 'batch', 'Batch size', 50, 'CRAWL_DETAIL_BATCH')
    const pauseSec = await resolveNumber(ctx, 'pause', 'Pause between rounds (sec)', 120, 'CRAWL_DETAIL_PAUSE_SEC')
    const cooldownSec = await resolveNumber(ctx, 'cooldown', 'Initial cooldown (sec)', 180, 'CRAWL_DETAIL_COOLDOWN_SEC')

    const remainingSql = "SELECT COUNT(*) FROM tenders WHERE source='zakazky-gov' AND detail_fetched_at IS NULL;"

    p.log.info(`Full detail ingestion → ${base} (batch=${batch}, pause=${pauseSec}s, cooldown=${cooldownSec}s)`)
    p.log.info(`Waiting ${cooldownSec}s for API rate limit cooldown...`)
    await sleep(cooldownSec * 1000)

    let round = 1
    while (true) {
      const left = Number(await sqliteScalar(db, remainingSql))
      if (left === 0) {
        p.log.success('Done — all tenders have detail.')
        break
      }

      p.log.step(`--- Round ${round}: ${left} remaining ---`)
      const body = await postCrawl(`${base}/api/crawl/zakazky-gov/detail?limit=${batch}`)
      const processed
        = body && typeof body === 'object' && 'tendersFound' in body
          ? Number((body as { tendersFound: unknown }).tendersFound)
          : NaN

      if (!Number.isFinite(processed) || processed === 0) {
        p.log.warn(`No progress this round; waiting ${pauseSec}s before retry...`)
      }

      const leftAfter = Number(await sqliteScalar(db, remainingSql))
      if (leftAfter === 0) {
        p.log.success('Done — all tenders have detail.')
        break
      }

      p.log.info(`Still ${leftAfter} remaining; pausing ${pauseSec}s...`)
      await sleep(pauseSec * 1000)
      round += 1
    }

    const summary = await sqliteExec(
      db,
      [
        'SELECT',
        "  (SELECT COUNT(*) FROM tenders WHERE source='zakazky-gov') AS total,",
        "  (SELECT COUNT(*) FROM tenders WHERE source='zakazky-gov' AND detail_fetched_at IS NOT NULL) AS detail_fetched,",
        '  (SELECT COUNT(*) FROM tender_documents) AS documents;',
      ].join('\n'),
    )
    p.note(summary || '(empty)', 'DB summary')
  },
} satisfies Script
