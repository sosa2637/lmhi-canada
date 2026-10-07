import { createClient } from "@libsql/client";
import { del } from "@vercel/blob";
import { unlink } from "node:fs/promises";
import path from "node:path";
const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
});
try {
  const settings = await db.execute(
    "SELECT data FROM content WHERE id='settings'",
  );
  const brochures =
    JSON.parse(String(settings.rows[0]?.data || "{}")).brochures || [];
  const rows = await db.execute({
    sql: "SELECT key FROM pending_uploads WHERE expires<?",
    args: [Date.now()],
  });
  for (const row of rows.rows) {
    const key = String(row.key);
    const used = brochures.some(
      (b) => b.url === "/api/files?key=" + encodeURIComponent(key),
    );
    if (!used) {
      if (process.env.STORAGE_DRIVER === "vercel") await del(key);
      else {
        if (process.env.VERCEL)
          throw new Error("Local storage is not supported on Vercel");
        if (!/^[a-zA-Z0-9/_-]+$/.test(key) || key.includes(".."))
          throw new Error("Invalid key");
        try {
          await unlink(
            path.join(
              process.env.DATA_DIRECTORY || path.join(process.cwd(), "data"),
              "uploads",
              key,
            ),
          );
        } catch (e) {
          if (e.code !== "ENOENT") throw e;
        }
      }
    }
    await db.execute({
      sql: "DELETE FROM pending_uploads WHERE key=?",
      args: [key],
    });
  }
  console.log(rows.rows.length + " autorisations expirées nettoyées.");
} finally {
  db.close();
}
