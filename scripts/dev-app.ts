import { spawn, type ChildProcess } from 'node:child_process'
import color from 'picocolors'
import type { Script } from './_lib/types.ts'
import { multiselectOrCancel } from './_lib/prompt.ts'
import { getRepoRoot, withLocalBins } from './_lib/run.ts'

const APPS = [
  { label: 'fe-vue', value: 'fe-vue' },
  { label: 'fe-nuxt4', value: 'fe-nuxt4' },
  { label: 'fe-nuxt5', value: 'fe-nuxt5' },
] as const

type AppName = (typeof APPS)[number]['value']

const PREFIX_COLORS = [color.cyan, color.magenta, color.green, color.yellow, color.blue] as const

function parseApps(argv: string[]): AppName[] {
  const names = new Set<AppName>()
  const allowed = new Set<string>(APPS.map((a) => a.value))

  for (const arg of argv) {
    if (!arg.startsWith('--app=')) {
      continue
    }

    for (const part of arg.slice('--app='.length).split(',')) {
      const name = part.trim()
      if (!name) {
        continue
      }
      if (!allowed.has(name)) {
        throw new Error(`Unknown app: ${name}. Expected one of ${[...allowed].join(', ')}`)
      }
      names.add(name as AppName)
    }
  }

  return [...names]
}

function pipePrefixed(stream: NodeJS.ReadableStream | null, out: NodeJS.WriteStream, prefix: string): void {
  if (!stream) {
    return
  }

  let buffer = ''
  stream.on('data', (chunk: Buffer | string) => {
    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      out.write(`${prefix} ${line}\n`)
    }
  })
  stream.on('end', () => {
    if (buffer) {
      out.write(`${prefix} ${buffer}\n`)
    }
  })
}

function runAppsConcurrently(apps: AppName[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const children: ChildProcess[] = []
    let shuttingDown = false
    let settled = false

    const finish = (error?: Error) => {
      if (settled) {
        return
      }
      settled = true
      process.off('SIGINT', onSignal)
      process.off('SIGTERM', onSignal)
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    }

    const killAll = () => {
      for (const child of children) {
        if (!child.killed) {
          child.kill('SIGTERM')
        }
      }
    }

    const shutdown = (error?: Error) => {
      if (shuttingDown) {
        return
      }
      shuttingDown = true
      killAll()
      finish(error)
    }

    const onSignal = () => shutdown()

    process.on('SIGINT', onSignal)
    process.on('SIGTERM', onSignal)

    for (const [index, app] of apps.entries()) {
      const paint = PREFIX_COLORS[index % PREFIX_COLORS.length]!
      const prefix = paint(`[${app}]`)
      const child = spawn('vp', ['run', `${app}#dev`], {
        cwd,
        shell: process.platform === 'win32',
        stdio: ['inherit', 'pipe', 'pipe'],
        env: withLocalBins(cwd),
      })

      children.push(child)
      pipePrefixed(child.stdout, process.stdout, prefix)
      pipePrefixed(child.stderr, process.stderr, prefix)

      child.on('error', (error) => shutdown(error))

      child.on('close', (code, signal) => {
        if (shuttingDown) {
          return
        }

        if (signal || code !== 0) {
          shutdown(new Error(`[${app}] exited with code ${code ?? signal ?? 'unknown'}`))
          return
        }

        // Clean exit of one app while others still run — keep going until all done
        if (children.every((c) => c.exitCode !== null || c.signalCode !== null)) {
          shutdown()
        }
      })
    }
  })
}

export default {
  id: 'dev',
  label: 'Dev (pick apps)',
  group: 'Dev',
  hint: 'Run one or more apps via vp run <app>#dev',
  async run(ctx) {
    let apps = parseApps(ctx.argv)

    if (apps.length === 0 && ctx.interactive) {
      const picked = await multiselectOrCancel('Dev targets (space to toggle)', [...APPS], {
        required: true,
        initialValues: ['fe-vue'],
      })
      if (!picked) {
        throw new Error('Cancelled.')
      }
      apps = picked
    }

    if (apps.length === 0) {
      throw new Error('Missing apps. Pass --app=fe-vue or --app=fe-vue,fe-nuxt4 (comma-separated)')
    }

    const root = ctx.root || getRepoRoot()

    if (apps.length === 1) {
      const app = apps[0]!
      await new Promise<void>((resolve, reject) => {
        const child = spawn('vp', ['run', `${app}#dev`], {
          cwd: root,
          shell: process.platform === 'win32',
          stdio: 'inherit',
          env: withLocalBins(root),
        })
        child.on('error', reject)
        child.on('close', (code) => {
          if (code === 0) {
            resolve()
            return
          }
          reject(new Error(`vp run ${app}#dev exited with code ${code ?? 'unknown'}`))
        })
      })
      return
    }

    await runAppsConcurrently(apps, root)
  },
} satisfies Script
