import { readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { DiscoveredScript, Script } from './types.ts'
import { getRepoRoot } from './run.ts'

function isScriptModule(value: unknown): value is { default: Script } {
  if (!value || typeof value !== 'object') {
    return false
  }

  const mod = value as { default?: Partial<Script> }
  return (
    typeof mod.default?.id === 'string' &&
    typeof mod.default?.label === 'string' &&
    typeof mod.default?.run === 'function'
  )
}

async function listTsFiles(dir: string, recursive: boolean): Promise<string[]> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []
    }
    throw error
  }

  const files: string[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) {
      continue
    }

    const full = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (recursive) {
        files.push(...(await listTsFiles(full, true)))
      }
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.ts') || entry.name.endsWith('.d.ts')) {
      continue
    }

    files.push(full)
  }

  return files
}

async function loadScript(filePath: string, scope: string): Promise<DiscoveredScript | null> {
  const mod = await import(pathToFileURL(filePath).href)

  if (!isScriptModule(mod)) {
    return null
  }

  const script = mod.default

  return {
    ...script,
    scope,
    key: `${scope}/${script.id}`,
    filePath,
  }
}

export async function discoverScripts(root = getRepoRoot()): Promise<DiscoveredScript[]> {
  const discovered: DiscoveredScript[] = []
  const rootScriptsDir = join(root, 'scripts')
  const rootFiles = await listTsFiles(rootScriptsDir, false)

  for (const filePath of rootFiles) {
    const rel = relative(rootScriptsDir, filePath)
    if (rel === 'main.ts') {
      continue
    }

    const script = await loadScript(filePath, 'root')
    if (script) {
      discovered.push(script)
    }
  }

  const appsDir = join(root, 'apps')
  let appEntries
  try {
    appEntries = await readdir(appsDir, { withFileTypes: true })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return discovered.sort((a, b) => a.key.localeCompare(b.key))
    }
    throw error
  }

  for (const entry of appEntries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) {
      continue
    }

    const scriptsDir = join(appsDir, entry.name, 'scripts')
    const files = await listTsFiles(scriptsDir, true)

    for (const filePath of files) {
      const script = await loadScript(filePath, entry.name)
      if (script) {
        discovered.push(script)
      }
    }
  }

  return discovered.sort((a, b) => a.key.localeCompare(b.key))
}
