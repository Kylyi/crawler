import { execFile } from 'node:child_process'
import { constants } from 'node:fs'
import { access } from 'node:fs/promises'
import { promisify } from 'node:util'
import { confirmOrCancel, textOrCancel } from '../../../scripts/_lib/prompt.ts'
import { flagString, parseFlags, run, sleep } from '../../../scripts/_lib/run.ts'
import type { Script } from '../../../scripts/_lib/types.ts'

const execFileAsync = promisify(execFile)

/** Prefer Homebrew's GitHub CLI — Vite+ shims `gh` to an unrelated npm package. */
async function resolveGithubCli(): Promise<string> {
  for (const candidate of ['/opt/homebrew/bin/gh', '/usr/local/bin/gh']) {
    try {
      await access(candidate, constants.X_OK)

      return candidate
    } catch {
      // try next
    }
  }

  throw new Error(
    'GitHub CLI not found at /opt/homebrew/bin/gh. Install with: brew install gh\n'
    + 'Note: plain `gh` may be shadowed by Vite+ (~/.vite-plus/bin/gh).',
  )
}

async function currentRef(cwd: string): Promise<string> {
  const { stdout } = await execFileAsync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd })

  return stdout.trim()
}

async function latestRunId(gh: string, cwd: string, ref: string): Promise<string | undefined> {
  const { stdout } = await execFileAsync(
    gh,
    [
      'run',
      'list',
      '--workflow=fe-vue-ci.yml',
      `--branch=${ref}`,
      '--limit=1',
      '--json',
      'databaseId',
      '--jq',
      '.[0].databaseId',
    ],
    { cwd },
  )

  const id = stdout.trim()

  return id || undefined
}

export default {
  id: 'ci:run',
  label: 'Run fe-vue CI on GitHub Actions',
  hint: 'workflow_dispatch via gh; --ref=branch --watch',
  group: 'Test',
  async run(ctx) {
    const gh = await resolveGithubCli()
    const flags = parseFlags(ctx.argv)
    let ref = flagString(flags, 'ref')
    let watch = flags.watch === true

    if (!ref) {
      const current = await currentRef(ctx.root)

      if (ctx.interactive) {
        ref
          = (await textOrCancel('Git ref (branch or SHA)', {
            defaultValue: current,
          })) ?? undefined
      } else {
        ref = current
      }
    }

    if (!ref) {
      throw new Error('Cancelled.')
    }

    if (ctx.interactive && flags.watch === undefined) {
      const shouldWatch = await confirmOrCancel('Watch the run until it finishes?', true)
      if (shouldWatch === null) {
        throw new Error('Cancelled.')
      }
      watch = shouldWatch
    }

    await run(gh, ['workflow', 'run', 'fe-vue-ci.yml', '--ref', ref], { cwd: ctx.root })

    if (!watch) {
      return
    }

    let runId: string | undefined
    for (let attempt = 0; attempt < 10; attempt++) {
      await sleep(1500)
      runId = await latestRunId(gh, ctx.root, ref)
      if (runId) {
        break
      }
    }

    if (!runId) {
      throw new Error('Triggered workflow, but could not find a run id to watch yet.')
    }

    await run(gh, ['run', 'watch', runId, '--exit-status'], { cwd: ctx.root })
  },
} satisfies Script
