import { sameOrigin, db, bucket } from "@/lib/store";
import { cloudStorage } from "@/lib/storage";
import { pending, validFile } from "@/lib/uploads";
export const runtime = "nodejs";
export async function POST(r: Request) {
  if (cloudStorage() || process.env.VERCEL)
    return new Response(null, { status: 404 });
  if (!sameOrigin(r)) return new Response(null, { status: 403 });
  try {
    if (Number(r.headers.get("content-length")) > 11 * 1024 * 1024)
      return new Response(null, { status: 413 });
    const f = await r.formData();
    const key = String(f.get("key"));
    const row = await pending(key, String(f.get("ticket")));
    const file = f.get("file");
    if (!(file instanceof File) || file.size !== row.size)
      return Response.json({ error: "Fichier invalide." }, { status: 400 });
    const bytes = await file.arrayBuffer();
    if (!validFile(row.name, new Uint8Array(bytes)))
      return Response.json({ error: "Format invalide." }, { status: 400 });
    const issued = await db()
      .prepare(
        "UPDATE pending_uploads SET issued=1 WHERE key=? AND issued=0 RETURNING key",
      )
      .bind(key)
      .first();
    if (!issued) return new Response(null, { status: 409 });
    await bucket().put(key, bytes);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Téléversement indisponible." },
      { status: 503 },
    );
  }
}
