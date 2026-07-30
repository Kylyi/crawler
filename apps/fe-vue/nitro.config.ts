import { defineConfig } from "nitro";

const isCloudflarePages =
  process.env.NITRO_PRESET === "cloudflare_pages" ||
  process.env.NITRO_PRESET === "cloudflare-pages";

export default defineConfig({
  serverDir: "./server",
  compatibilityDate: "2025-04-01",
  cloudflare: {
    deployConfig: true,
    nodeCompat: true,
  },
  experimental: {
    asyncContext: true,
    tasks: !isCloudflarePages,
  },
  ...(isCloudflarePages
    ? {}
    : {
        scheduledTasks: {
          "*/5 * * * * *": ["db:migrate"],
        },
      }),
});
