export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { db, sameOrigin } from "@/lib/store";
export async function POST(r: Request) {
  if (!sameOrigin(r)) return new Response(null, { status: 403 });
  try {
    const x = (await r.json()) as { path: string };
    if (
      typeof x.path !== "string" ||
      x.path.length > 100 ||
      !/^\/(en\/?)?([a-z-]+)?$/.test(x.path) ||
      x.path.includes("gestion")
    )
      return new Response(null, { status: 400 });
    const day = new Date().toISOString().slice(0, 10);
    await db()
      .prepare(
        "INSERT INTO page_views(id,day,path,count) VALUES(?,?,?,1) ON CONFLICT(id) DO UPDATE SET count=count+1",
      )
      .bind(day + ":" + x.path, day, x.path)
      .run();
    return new Response(null, { status: 204 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
