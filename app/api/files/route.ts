import { verifyUploaded } from "@/lib/uploads";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { admin, db, bucket, sameOrigin } from "@/lib/store";
export async function POST(r: Request) {
  if (!(await admin(r)) || !sameOrigin(r))
    return new Response(null, { status: 403 });
  try {
    const x = await r.json();
    const file = await verifyUploaded(x.key, x.ticket, "brochures");
    if (!file.name.toLowerCase().endsWith(".pdf"))
      return new Response(null, { status: 400 });
    return Response.json({
      url: "/api/files?key=" + encodeURIComponent(file.key),
      name: file.name,
    });
  } catch {
    return Response.json(
      { error: "Téléversement indisponible." },
      { status: 503 },
    );
  }
}
export async function GET(r: Request) {
  const key = new URL(r.url).searchParams.get("key");
  if (!key) return new Response("Not found", { status: 404 });
  try {
    let name = "document.pdf";
    if (!key.startsWith("brochures/")) {
      if (!(await admin(r))) return new Response("Forbidden", { status: 403 });
      const id = key.split("/")[0];
      const row = await db()
        .prepare("SELECT files FROM submissions WHERE id=?")
        .bind(id)
        .first<{ files: string }>();
      const file =
        row &&
        JSON.parse(row.files).find((f: { key: string }) => f.key === key);
      if (!file) return new Response("Not found", { status: 404 });
      name = file.name;
    } else {
      const row = await db()
        .prepare("SELECT data FROM content WHERE id=?")
        .bind("settings")
        .first<{ data: string }>();
      const found =
        row &&
        JSON.parse(row.data).brochures?.some(
          (f: { url: string }) =>
            f.url === "/api/files?key=" + encodeURIComponent(key),
        );
      if (!found && !(await admin(r)))
        return new Response("Not found", { status: 404 });
    }
    const file = await bucket().get(key);
    if (!file) return new Response("Not found", { status: 404 });
    return new Response(file.body, {
      headers: {
        "Content-Type": key.startsWith("brochures/")
          ? "application/pdf"
          : "application/octet-stream",
        "Content-Disposition":
          "attachment; filename*=UTF-8''" + encodeURIComponent(name),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Unavailable", { status: 503 });
  }
}
