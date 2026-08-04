# `@crawler/eslint-config`

Shared lint preferences. **ESLint is the source of truth.**

| Export                              | Use for                                  |
| ----------------------------------- | ---------------------------------------- |
| `@crawler/eslint-config`            | Nuxt apps (`eslint`)                     |
| `@crawler/eslint-config/vue`        | Vue SPA (`eslint`)                       |
| `@crawler/eslint-config/typescript` | Pure TS packages (`eslint`)              |
| `@crawler/eslint-config/oxlint`     | Vite+ `lint` / `fmt` blocks (`vp check`) |

```js
// eslint.config.mjs
import config from '@crawler/eslint-config'
export default config
```

```ts
// vite.config.ts — keep Oxlint aligned with ESLint
import { defineConfig } from 'vite-plus'
import { eslintAlignedFmt, eslintAlignedLint } from '@crawler/eslint-config/oxlint'

export default defineConfig({
  fmt: eslintAlignedFmt,
  lint: eslintAlignedLint,
})
```

| Command                                   | Engine                             |
| ----------------------------------------- | ---------------------------------- |
| `pnpm lint` / `eslint .` / VS Code ESLint | ESLint flat config                 |
| `vp lint` / `vp check`                    | Oxlint + Oxfmt via `oxlint` export |

When you change ESLint rules, update `oxlint.mjs` to match where Oxlint has an equivalent.
