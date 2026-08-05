import * as p from '@clack/prompts'
import color from 'picocolors'
import { discoverScripts } from './_lib/discover.ts'
import { selectOrCancel } from './_lib/prompt.ts'
import { getRepoRoot } from './_lib/run.ts'
import type { DiscoveredScript, ScriptContext } from './_lib/types.ts'

function isInteractive(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY)
}

function buildContext(script: DiscoveredScript, argv: string[]): ScriptContext {
  const root = getRepoRoot()
  return {
    root,
    scope: script.scope,
    appDir: script.scope === 'root' ? undefined : `${root}/apps/${script.scope}`,
    argv,
    interactive: isInteractive() && argv.length === 0,
  }
}

async function runScript(script: DiscoveredScript, argv: string[]): Promise<void> {
  const ctx = buildContext(script, argv)
  // When flags are present, treat as non-interactive for prompts that check ctx.interactive
  if (argv.length > 0) {
    ctx.interactive = false
  }

  await script.run(ctx)
}

async function pickFromList(message: string, scripts: DiscoveredScript[]): Promise<DiscoveredScript | null> {
  const id = await selectOrCancel(
    message,
    scripts.map((s) => ({
      label: s.label,
      value: s.key,
      hint: s.hint ?? s.id,
    })),
  )

  if (!id) {
    return null
  }

  return scripts.find((s) => s.key === id) ?? null
}

function printUsage(scripts: DiscoveredScript[]): void {
  console.log('Usage: vp run scripts -- <scope/id> [--flag=value]')
  console.log('       vp run scripts              # interactive menu (requires a TTY)')
  console.log('')
  console.log('Available scripts:')
  for (const s of scripts) {
    console.log(`  ${s.key.padEnd(40)} ${s.label}`)
  }
}

async function interactiveMenu(scripts: DiscoveredScript[]): Promise<void> {
  if (!isInteractive()) {
    console.error('Interactive menu requires a TTY. Pass a script id instead:\n')
    printUsage(scripts)
    process.exitCode = 1
    return
  }

  p.intro(`${color.bgCyan(color.black(' crawler scripts '))}`)

  if (scripts.length === 0) {
    p.log.warn('No scripts discovered.')
    p.outro('Done.')
    return
  }

  const scopes = [...new Set(scripts.map((s) => s.scope))].sort()

  let scoped = scripts

  if (scopes.length > 1) {
    const scope = await selectOrCancel(
      'Select scope',
      scopes.map((s) => ({
        label: s === 'root' ? 'Root' : s,
        value: s,
        hint: `${scripts.filter((x) => x.scope === s).length} scripts`,
      })),
    )

    if (!scope) {
      return
    }

    scoped = scripts.filter((s) => s.scope === scope)
  }

  const groups = [...new Set(scoped.map((s) => s.group).filter((g): g is string => Boolean(g)))].sort()

  let candidates = scoped

  if (groups.length > 0) {
    const ungrouped = scoped.filter((s) => !s.group)
    const groupChoice = await selectOrCancel('Select group', [
      ...groups.map((g) => ({
        label: g,
        value: g,
        hint: `${scoped.filter((s) => s.group === g).length} scripts`,
      })),
      ...(ungrouped.length > 0 ? [{ label: 'Other', value: '__other__', hint: `${ungrouped.length} scripts` }] : []),
    ])

    if (!groupChoice) {
      return
    }

    candidates = groupChoice === '__other__' ? ungrouped : scoped.filter((s) => s.group === groupChoice)
  }

  const selected = await pickFromList('Select script', candidates)

  if (!selected) {
    return
  }

  try {
    await runScript(selected, [])
    p.outro('Done.')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message === 'Cancelled.') {
      process.exitCode = 0
      return
    }
    p.log.error(message)
    process.exitCode = 1
  }
}

async function directRun(scripts: DiscoveredScript[], key: string, argv: string[]): Promise<void> {
  const script =
    scripts.find((s) => s.key === key) ??
    scripts.find((s) => s.id === key) ??
    scripts.find((s) => s.key.endsWith(`/${key}`))

  if (!script) {
    console.error(`Unknown script: ${key}`)
    console.error('Available:')
    for (const s of scripts) {
      console.error(`  ${s.key}`)
    }
    process.exitCode = 1
    return
  }

  try {
    await runScript(script, argv)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}

async function main(): Promise<void> {
  const scripts = await discoverScripts()
  const argv = process.argv.slice(2)
  // npm/pnpm/vp often forward a literal "--" before script args
  if (argv[0] === '--') {
    argv.shift()
  }

  if (argv.length === 0) {
    await interactiveMenu(scripts)
    return
  }

  const [key, ...rest] = argv
  await directRun(scripts, key!, rest)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
})
