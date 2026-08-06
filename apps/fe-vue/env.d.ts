/// <reference types="vite/client" />
/// <reference types="@cloudflare/workers-types" />

type CloudflareEnv = {
  DB: D1Database
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, unknown>
  export default component
}
