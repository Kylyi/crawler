import { defineConfig } from "nitro";

export default defineConfig({
  serverDir: "./server",
  experimental: {
    asyncContext: true,
    tasks: true,
  },
  scheduledTasks: {
    "*/5 * * * * *": ["db:migrate"],
  },
});
