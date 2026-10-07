import { createClient, type Client, type InValue } from "@libsql/client";
let connection: Client | undefined;
export function client() {
  if (!connection) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is required. Run npm run setup.");
    if (process.env.VERCEL && url.startsWith("file:"))
      throw new Error("Vercel requires a remote Turso database.");
    connection = createClient({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN || undefined,
    });
  }
  return connection;
}
// Small prepared-query adapter. SQL and migrations remain ordinary SQLite.
export function db() {
  return {
    prepare(sql: string) {
      let args: InValue[] = [];
      return {
        bind(...values: InValue[]) {
          args = values;
          return this;
        },
        async first<T = Record<string, unknown>>() {
          const r = await client().execute({ sql, args });
          return (r.rows[0] || null) as T | null;
        },
        async all() {
          const r = await client().execute({ sql, args });
          return { results: r.rows };
        },
        async run() {
          return client().execute({ sql, args });
        },
      };
    },
  };
}
