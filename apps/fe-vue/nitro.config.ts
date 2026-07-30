import { defineConfig } from "nitro";

const isCloudflarePages =
  process.env.NITRO_PRESET === "cloudflare_pages" ||
  process.env.NITRO_PRESET === "cloudflare-pages";

// Cloudflare cron uses 5 fields (minute hour day month weekday), min 1-minute intervals.
const migrateCron = isCloudflarePages ? "0 3 * * *" : "*/5 * * * * *";

export default defineConfig({
  serverDir: "./server",
  compatibilityDate: "2025-04-01",
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
    // Nitro auto-writes cron triggers for Workers, but not for Pages — set manually.
    wrangler: isCloudflarePages
      ? {
          triggers: {
            crons: [migrateCron],
          },
        }
      : undefined,
  },
  experimental: {
    asyncContext: true,
    tasks: true,
  },
  scheduledTasks: {
    [migrateCron]: ["db:migrate"],
  },
});
