import { defineConfig } from "nitro";

const isCloudflareDeploy =
  process.env.NITRO_PRESET === "cloudflare_pages" ||
  process.env.NITRO_PRESET === "cloudflare-pages" ||
  process.env.NITRO_PRESET === "cloudflare_module" ||
  process.env.NITRO_PRESET === "cloudflare-module";

// Cloudflare cron: 5 fields (minute hour day month weekday). No seconds field.
const migrateCron = isCloudflareDeploy ? "*/1 * * * *" : "*/5 * * * * *";

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
    tasks: true,
  },
  scheduledTasks: {
    [migrateCron]: ["db:migrate"],
  },
});
