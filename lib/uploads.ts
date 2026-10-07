import { db, bucket, sign } from "./store";
export type Attachment = { key: string; name: string; size: number };
export async function pending(key: string, ticket: string) {
  if (
    !/^(brochures|[-a-f0-9]{36})\/[-a-f0-9]{36}$/.test(key) ||
    ticket !== (await sign("upload:" + key))
  )
    throw new Error("Pièce jointe non autorisée.");
  const row = await db()
    .prepare("SELECT * FROM pending_uploads WHERE key=? AND expires>?")
    .bind(key, Date.now())
    .first<Attachment & { parent: string }>();
  if (!row) throw new Error("Téléversement expiré.");
  return row;
}
export function validFile(name: string, a: Uint8Array) {
  const ext = name.split(".").pop()?.toLowerCase();
  return (
    (ext === "pdf" && Buffer.from(a.slice(0, 5)).toString() === "%PDF-") ||
    (["jpg", "jpeg"].includes(ext || "") &&
      a[0] === 255 &&
      a[1] === 216 &&
      a[2] === 255) ||
    (ext === "png" &&
      a[0] === 137 &&
      a[1] === 80 &&
      a[2] === 78 &&
      a[3] === 71) ||
    (ext === "docx" && a[0] === 80 && a[1] === 75 && a[2] === 3 && a[3] === 4)
  );
}
export async function verifyUploaded(
  key: string,
  ticket: string,
  parent: string,
) {
  const row = await pending(key, ticket);
  if (row.parent !== parent) throw new Error("Pièce jointe non autorisée.");
  const info = await bucket().info(key);
  if (info.size !== row.size || info.size > 10 * 1024 * 1024)
    throw new Error("Taille de pièce jointe invalide.");
  const object = await bucket().get(key);
  if (!object) throw new Error("Fichier introuvable.");
  const bytes = new Uint8Array(await new Response(object.body).arrayBuffer());
  if (!validFile(row.name, bytes))
    throw new Error("Format de pièce jointe invalide.");
  return { key: row.key, name: row.name, size: row.size };
}
