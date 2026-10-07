import { createClient } from "@libsql/client";
import { readdir, readFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
export async function migrate() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL manquante. Lancez npm run setup.");
  if (url.startsWith("file:")) await mkdir("data", { recursive: true });
  const db = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
  });
  try {
    await db.execute(
      "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, checksum TEXT NOT NULL, applied INTEGER NOT NULL)",
    );
    for (const name of (await readdir("migrations"))
      .filter((x) => x.endsWith(".sql"))
      .sort()) {
      const sql = await readFile("migrations/" + name, "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const current = await db.execute({
        sql: "SELECT checksum FROM _migrations WHERE name=?",
        args: [name],
      });
      if (current.rows.length) {
        if (current.rows[0].checksum !== checksum)
          throw new Error("Migration déjà appliquée modifiée : " + name);
        continue;
      }
      const statements = sql
        .replaceAll("--> statement-breakpoint", "")
        .split(";")
        .map((x) => x.trim())
        .filter(Boolean);
      await db.batch(
        [
          ...statements.map((sql) => ({ sql, args: [] })),
          {
            sql: "INSERT INTO _migrations(name,checksum,applied) VALUES(?,?,?)",
            args: [name, checksum, Date.now()],
          },
        ],
        "write",
      );
      console.log("Migration appliquée : " + name);
    }
  } finally {
    db.close();
  }
}
if (process.argv[1]?.endsWith("migrate.mjs")) await migrate();
