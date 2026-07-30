import { defineTask } from "nitro/task";

export default defineTask({
  meta: {
    name: "db:migrate",
    description: "Run database migrations",
  },
  run() {
    console.log("Running DB migration task...");
    return { result: "Success" };
  },
});
