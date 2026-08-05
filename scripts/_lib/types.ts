export type ScriptContext = {
  root: string
  /** Absolute path to the app directory when the script lives under apps/<name>/scripts */
  appDir?: string
  /** App folder name (e.g. fe-vue) or "root" */
  scope: string
  /** Remaining argv after the script id (flags like --limit=50) */
  argv: string[]
  interactive: boolean
}

export type Script = {
  /** Unique within a scope, e.g. crawl:zakazky-gov */
  id: string
  label: string
  hint?: string
  /** Optional submenu grouping within a scope */
  group?: string
  run: (ctx: ScriptContext) => Promise<void>
}

export type DiscoveredScript = Script & {
  scope: string
  /** Fully-qualified id: scope/id */
  key: string
  filePath: string
}
