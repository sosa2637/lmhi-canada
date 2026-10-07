import { defaultSettings } from "@/app/content";
import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "./database";
export { db } from "./database";
export { bucket } from "./storage";
export { admin } from "./auth";
export async function settings() {
  const r = await db()
    .prepare("SELECT data FROM content WHERE id = ?")
    .bind("settings")
    .first<{ data: string }>();
  return { ...defaultSettings, ...(r ? JSON.parse(r.data) : {}) };
}
export function sameOrigin(r: Request) {
  const o = r.headers.get("origin");
  if (!o) return false;
  const allowed = new Set([new URL(r.url).origin]);
  if (process.env.APP_URL) allowed.add(new URL(process.env.APP_URL).origin);
  if (process.env.VERCEL_URL) allowed.add("https://" + process.env.VERCEL_URL);
  return allowed.has(o);
}
export async function sign(value: string) {
  const secret = process.env.FORM_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("FORM_SECRET must be configured.");
  return createHmac("sha256", secret).update(value).digest("hex");
}
export async function validFormToken(token: string, minAge = 2000) {
  const parts = token.split(".");
  if (
    parts.length !== 3 ||
    !/^\d+$/.test(parts[0]) ||
    !/^[-a-f0-9]{36}$/.test(parts[1]) ||
    !/^[-a-f0-9]{64}$/.test(parts[2])
  )
    return false;
  const age = Date.now() - Number(parts[0]);
  if (age < minAge || age > 3600000) return false;
  return timingSafeEqual(
    Buffer.from(await sign(parts.slice(0, 2).join(".")), "hex"),
    Buffer.from(parts[2], "hex"),
  );
}
export function clientIp(r: Request) {
  return process.env.VERCEL
    ? r.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
    : "local";
}
export async function rateLimit(key: string, max: number, window = 3600000) {
  const now = Date.now();
  const id = await sign(key + ":" + Math.floor(now / window));
  const row = await db()
    .prepare(
      "INSERT INTO rate_limits(id,count,expires) VALUES(?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 RETURNING count",
    )
    .bind(id, now + window * 2)
    .first<{ count: number }>();
  await db()
    .prepare("DELETE FROM rate_limits WHERE expires < ?")
    .bind(now)
    .run();
  return !!row && row.count <= max;
}
