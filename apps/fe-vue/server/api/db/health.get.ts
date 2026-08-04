import { defineHandler } from "nitro";
import { useDatabase } from "nitro/database";

export default defineHandler(async () => {
  const db = useDatabase();

  try {
    const { rows } = await db.sql`
      SELECT COUNT(*) as count FROM tenders
    `;

    return {
      ok: true,
      ready: true,
      tenders: (rows?.[0] as { count: number } | undefined)?.count ?? 0,
    };
  } catch {
    return {
      ok: true,
      ready: false,
      tenders: 0,
    };
  }
});
