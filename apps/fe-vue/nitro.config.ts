import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  compatibilityDate: "2025-04-01",
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    wrangler: {
      name: "fe-vue",
    },
  },
  experimental: {
    asyncContext: true,
    database: true,
    tasks: true,
  },
  scheduledTasks: {
    "*/30 * * * *": ["crawl-zakazky-gov"],
    "15,45 * * * *": ["crawl-zakazky-gov-detail"],
  },
  database: {
    default: {
      connector: "cloudflare-d1",
      options: {
        bindingName: "DB",
      },
    },
  },
  devDatabase: {
    default: {
      connector: "sqlite",
      options: {
        name: "dev-db",
      },
    },
  },
});
