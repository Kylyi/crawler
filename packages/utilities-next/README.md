# `@gentl/utilities`

Dual-mode utilities package:

- **Nuxt layer** — `extends: ['@gentl/utilities']`
- **Vue library** — `import { createUtilities, formatValue } from '@gentl/utilities/vue'`
- **Core** — `import { filterData, ComparatorEnum } from '@gentl/utilities/core'`

## Layout

| Path                            | Role                                        |
| ------------------------------- | ------------------------------------------- |
| `core/`                         | Framework-agnostic logic + config singleton |
| `vue/`                          | `createUtilities()` plugin + composables    |
| `app/` / `modules/` / `server/` | Nuxt layer glue                             |

Legacy reference implementation lives at `packages/Utilities` (`@gentl/utilities-legacy`).

## TypeScript

Nuxt owns the root [`tsconfig.json`](tsconfig.json) (project references into `.nuxt/tsconfig.*.json` — auto-imports, `#i18n`, generated types).

Standalone surfaces keep their own configs:

| Command | Config | Scope |
|---------|--------|--------|
| `pnpm typecheck:nuxt` | Nuxt-generated | `app/`, `modules/`, `server/`, layer glue |
| `pnpm typecheck:core` | [`core/tsconfig.json`](core/tsconfig.json) | framework-agnostic (no Vue/Nuxt) |
| `pnpm typecheck:vue` | [`vue/tsconfig.json`](vue/tsconfig.json) | Vue plugin + composables (no Nuxt) |
| `pnpm typecheck` | all of the above | CI / local full check |
