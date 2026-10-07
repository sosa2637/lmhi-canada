export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { sign } from "@/lib/store";
export async function GET() {
  try {
    const payload = Date.now() + "." + crypto.randomUUID();
    return Response.json(
      { token: payload + "." + (await sign(payload)) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Formulaires momentanément indisponibles." },
      { status: 503 },
    );
  }
}
