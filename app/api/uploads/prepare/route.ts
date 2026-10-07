import {
  admin,
  db,
  sign,
  sameOrigin,
  validFormToken,
  rateLimit,
  clientIp,
} from "@/lib/store";
import { cloudStorage } from "@/lib/storage";
export const runtime = "nodejs";
export async function POST(r: Request) {
  if (!sameOrigin(r)) return new Response(null, { status: 403 });
  try {
    const x = await r.json();
    const isAdmin = x.purpose === "brochure";
    if (
      isAdmin
        ? !(await admin(r))
        : !(await validFormToken(String(x.token || "")))
    )
      return Response.json(
        { error: "Autorisation expirée. Rechargez le formulaire." },
        { status: 403 },
      );
    if (!(await rateLimit("uploads:" + clientIp(r), 30)))
      return Response.json(
        { error: "Limite de téléversement atteinte." },
        { status: 429 },
      );
    if (
      typeof x.name !== "string" ||
      x.name.length > 200 ||
      !Number.isInteger(x.size) ||
      x.size < 1 ||
      x.size > 10 * 1024 * 1024 ||
      !(isAdmin ? /\.pdf$/i : /\.(pdf|docx|png|jpe?g)$/i).test(x.name)
    )
      return Response.json(
        { error: "Fichier invalide (10 Mo maximum)." },
        { status: 400 },
      );
    const parent = isAdmin ? "brochures" : String(x.token).split(".")[1];
    const key = parent + "/" + crypto.randomUUID();
    await db()
      .prepare(
        "INSERT INTO pending_uploads(key,parent,name,size,expires) VALUES(?,?,?,?,?)",
      )
      .bind(key, parent, x.name, x.size, Date.now() + 3600000)
      .run();
    return Response.json({
      key,
      ticket: await sign("upload:" + key),
      driver: cloudStorage() ? "vercel" : "local",
    });
  } catch {
    return Response.json(
      { error: "Téléversement indisponible." },
      { status: 503 },
    );
  }
}
