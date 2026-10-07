export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { admin, db, bucket, settings, sameOrigin } from "@/lib/store";
export async function GET(r: Request) {
  if (!(await admin(r)))
    return Response.json(
      { error: "Accès réservé à l’administrateur." },
      { status: 403 },
    );
  try {
    const rows = await db()
      .prepare("SELECT * FROM submissions ORDER BY created DESC LIMIT 500")
      .all();
    return Response.json(
      {
        settings: await settings(),
        submissions: rows.results,
        views: (
          await db()
            .prepare(
              "SELECT day, SUM(count) AS count FROM page_views GROUP BY day ORDER BY day DESC LIMIT 30",
            )
            .all()
        ).results,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Espace de gestion indisponible." },
      { status: 503 },
    );
  }
}
export async function POST(r: Request) {
  if (!(await admin(r)) || !sameOrigin(r))
    return Response.json({ error: "Accès refusé." }, { status: 403 });
  try {
    if (Number(r.headers.get("content-length")) > 200000)
      return Response.json(
        { error: "Contenu trop volumineux." },
        { status: 413 },
      );
    const x: any = await r.json();
    if (x.action === "settings") {
      if (JSON.stringify(x.data).length > 180000)
        return Response.json(
          { error: "Contenu trop volumineux." },
          { status: 413 },
        );
      await db()
        .prepare(
          "INSERT INTO content(id,data) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data",
        )
        .bind("settings", JSON.stringify(x.data))
        .run();
    } else if (x.action === "delete") {
      const row = await db()
        .prepare("SELECT files FROM submissions WHERE id=?")
        .bind(x.id)
        .first<{ files: string }>();
      if (row) {
        for (const f of JSON.parse(row.files)) await bucket().delete(f.key);
        await db()
          .prepare("DELETE FROM submissions WHERE id=?")
          .bind(x.id)
          .run();
      }
    } else if (
      x.action === "status" &&
      ["new", "reviewed", "closed"].includes(x.status)
    ) {
      await db()
        .prepare("UPDATE submissions SET status=? WHERE id=?")
        .bind(x.status, x.id)
        .run();
    } else return Response.json({ error: "Action invalide." }, { status: 400 });
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Enregistrement indisponible." },
      { status: 503 },
    );
  }
}
