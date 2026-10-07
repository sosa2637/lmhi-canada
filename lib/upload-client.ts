import { upload } from "@vercel/blob/client";
export async function uploadFile(
  file: File,
  token?: string,
  purpose = "submission",
) {
  const response = await fetch("/api/uploads/prepare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, size: file.size, token, purpose }),
  });
  const prepared = await response.json();
  if (!response.ok)
    throw new Error(prepared.error || "Téléversement indisponible.");
  if (prepared.driver === "vercel") {
    await upload(prepared.key, file, {
      access: "private",
      handleUploadUrl: "/api/uploads/blob",
      clientPayload: JSON.stringify({ ticket: prepared.ticket }),
      contentType: file.type || "application/octet-stream",
      multipart: true,
    });
  } else {
    const f = new FormData();
    f.set("file", file);
    f.set("key", prepared.key);
    f.set("ticket", prepared.ticket);
    const r = await fetch("/api/uploads/local", { method: "POST", body: f });
    if (!r.ok) {
      const x = await r.json();
      throw new Error(x.error || "Téléversement indisponible.");
    }
  }
  return { key: prepared.key, ticket: prepared.ticket };
}
