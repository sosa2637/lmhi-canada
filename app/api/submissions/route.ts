import {
  db,
  validFormToken,
  sameOrigin,
  rateLimit,
  clientIp,
} from "@/lib/store";
import { client } from "@/lib/database";
import { verifyUploaded } from "@/lib/uploads";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const required: Record<string, string[]> = {
  quote: [
    "company",
    "contact",
    "phone",
    "email",
    "service",
    "location",
    "date",
    "description",
  ],
  career: [
    "firstName",
    "lastName",
    "phone",
    "email",
    "trade",
    "experience",
    "location",
    "availability",
  ],
  partner: ["company", "location", "contact", "description", "phone", "email"],
  contact: ["contact", "email", "description"],
};
export async function POST(r: Request) {
  if (!sameOrigin(r))
    return Response.json({ error: "Origine refusée." }, { status: 403 });
  try {
    if (Number(r.headers.get("content-length")) > 100000)
      return new Response(null, { status: 413 });
    const f = await r.formData();
    if (f.get("website_trap"))
      return Response.json({ error: "Veuillez réessayer." }, { status: 400 });
    const token = String(f.get("token") || "");
    if (!(await validFormToken(token)))
      return Response.json(
        {
          error:
            "Formulaire expiré ou envoyé trop rapidement. Rechargez la page.",
        },
        { status: 400 },
      );
    const kind = String(f.get("kind"));
    if (!required[kind] || f.get("consent") !== "yes")
      return Response.json(
        { error: "Informations ou consentement manquants." },
        { status: 400 },
      );
    const data: Record<string, string> = {};
    for (const [k, v] of f.entries()) {
      if (
        typeof v === "string" &&
        ![
          "token",
          "website_trap",
          "consent",
          "kind",
          "attachments",
          "files",
        ].includes(k)
      ) {
        if (v.length > 6000)
          return Response.json({ error: "Texte trop long." }, { status: 400 });
        data[k] = v.trim();
      }
    }
    for (const k of required[kind])
      if (!data[k])
        return Response.json(
          { error: "Champs obligatoires manquants." },
          { status: 400 },
        );
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      return Response.json({ error: "Courriel invalide." }, { status: 400 });
    const id = token.split(".")[1];
    const existing = await db()
      .prepare("SELECT id FROM submissions WHERE id=?")
      .bind(id)
      .first();
    if (existing) return Response.json({ id }, { status: 200 });
    if (!(await rateLimit("submission:" + clientIp(r), 8)))
      return Response.json(
        { error: "Trop de demandes. Réessayez dans une heure." },
        { status: 429 },
      );
    const refs = JSON.parse(String(f.get("attachments") || "[]"));
    if (
      !Array.isArray(refs) ||
      refs.length > 3 ||
      new Set(refs.map((x: { key: string }) => x.key)).size !== refs.length
    )
      return Response.json(
        { error: "Pièces jointes invalides." },
        { status: 400 },
      );
    const attachments = [];
    for (const ref of refs) {
      attachments.push(
        await verifyUploaded(String(ref.key), String(ref.ticket), id),
      );
    }
    if (attachments.reduce((sum, a) => sum + a.size, 0) > 15 * 1024 * 1024)
      return Response.json(
        { error: "15 Mo maximum au total." },
        { status: 400 },
      );
    await client().batch(
      [
        {
          sql: "INSERT INTO submissions(id,kind,data,files,created,status) VALUES(?,?,?,?,?,?)",
          args: [
            id,
            kind,
            JSON.stringify(data),
            JSON.stringify(attachments),
            Date.now(),
            "new",
          ],
        },
        ...attachments.map((a) => ({
          sql: "DELETE FROM pending_uploads WHERE key=?",
          args: [a.key],
        })),
      ],
      "write",
    );
    return Response.json({ id }, { status: 201 });
  } catch (e) {
    console.error("Submission failed", e);
    return Response.json(
      {
        error:
          "Enregistrement impossible. Vérifiez les pièces jointes et réessayez; vos champs sont conservés.",
      },
      { status: 503 },
    );
  }
}
