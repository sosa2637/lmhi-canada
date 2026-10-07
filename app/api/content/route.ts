export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { settings } from "@/lib/store";
export async function GET() {
  try {
    return Response.json(await settings(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({}, { status: 503 });
  }
}
