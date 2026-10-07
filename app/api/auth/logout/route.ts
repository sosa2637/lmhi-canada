export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { sameOrigin } from "@/lib/store";
import { cookieName } from "@/lib/auth";
export async function POST(r: Request) {
  if (!sameOrigin(r)) return new Response(null, { status: 403 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return res;
}
