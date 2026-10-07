import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { pending } from "@/lib/uploads";
import { db, sameOrigin } from "@/lib/store";
import { cloudStorage } from "@/lib/storage";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!cloudStorage()) return new Response(null, { status: 404 });
  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!sameOrigin(request)) throw new Error("Origin rejected");
        const x = JSON.parse(clientPayload || "{}");
        const row = await pending(pathname, String(x.ticket || ""));
        const issued = await db()
          .prepare(
            "UPDATE pending_uploads SET issued=1 WHERE key=? AND issued=0 RETURNING key",
          )
          .bind(pathname)
          .first();
        if (!issued) throw new Error("Upload authorization already used");
        return {
          allowedContentTypes: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
            "application/octet-stream",
          ],
          maximumSizeInBytes: row.size,
          addRandomSuffix: false,
          allowOverwrite: false,
          validUntil: Date.now() + 600000,
          tokenPayload: JSON.stringify({ key: pathname }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(response);
  } catch {
    return Response.json(
      { error: "Autorisation de téléversement refusée." },
      { status: 400 },
    );
  }
}
