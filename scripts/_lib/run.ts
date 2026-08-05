import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getRepoRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '../..')
}

export function withLocalBins(cwd: string, env: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const root = getRepoRoot()
  const pathKey = process.platform === 'win32' ? 'Path' : 'PATH'
  const sep = process.platform === 'win32' ? ';' : ':'
  const bins = [join(cwd, 'node_modules', '.bin'), join(root, 'node_modules', '.bin')]
  const current = env[pathKey] ?? process.env[pathKey] ?? ''

  return {
    ...env,
    [pathKey]: [...bins, current].filter(Boolean).join(sep),
  }
}

export function run(command: string, args: string[], opts?: { cwd?: string; env?: NodeJS.ProcessEnv }): Promise<void> {
  return new Promise((resolve, reject) => {
    const cwd = opts?.cwd ?? getRepoRoot()
    const child = spawn(command, args, {
      cwd,
      env: withLocalBins(cwd, opts?.env ? { ...process.env, ...opts.env } : process.env),
      shell: process.platform === 'win32',
      stdio: 'inherit',
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code ?? 'unknown'}`))
    })
  })
}

export function parseFlags(argv: string[]): Record<string, string | boolean> {
  const flags: Record<string, string | boolean> = {}

  for (const arg of argv) {
    if (!arg.startsWith('--')) {
      continue
    }

    const body = arg.slice(2)
    const eq = body.indexOf('=')

    if (eq === -1) {
      flags[body] = true
      continue
    }

    flags[body.slice(0, eq)] = body.slice(eq + 1)
  }

  return flags
}

export function flagString(flags: Record<string, string | boolean>, name: string): string | undefined {
  const value = flags[name]
  return typeof value === 'string' ? value : undefined
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
