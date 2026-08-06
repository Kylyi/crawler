# `@crawler/eslint-config`

Shared ESLint flat configs. **ESLint is the only linter and formatter** (via `eslint-plugin-format` in the antfu/Nuxt presets).

| Export                              | Use for                     |
| ----------------------------------- | --------------------------- |
| `@crawler/eslint-config`            | Nuxt apps (`eslint`)        |
| `@crawler/eslint-config/vue`        | Vue SPA (`eslint`)          |
| `@crawler/eslint-config/typescript` | Pure TS packages (`eslint`) |

```js
// eslint.config.mjs
import config from '@crawler/eslint-config'

export default config
```

| Command                                   | Engine                            |
| ----------------------------------------- | --------------------------------- |
| `pnpm lint` / `eslint .` / VS Code ESLint | Lint + format (flat config)       |
| `vp check`                                | Skipped (`check.lint/fmt: false`) |
