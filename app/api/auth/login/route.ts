export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createSession, passwordMatches, cookieName } from "@/lib/auth";
import { sameOrigin, rateLimit, clientIp } from "@/lib/store";
export async function POST(r: Request) {
  if (!sameOrigin(r))
    return NextResponse.json(
      { error: "Origine non autorisée." },
      { status: 403 },
    );
  try {
    if (!(await rateLimit("login:" + clientIp(r), 10, 900000)))
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 15 minutes." },
        { status: 429 },
      );
    const { email, password } = await r.json();
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase() ||
      !(await passwordMatches(password))
    )
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 },
      );
    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieName, await createSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 28800,
    });
    return response;
  } catch {
    return NextResponse.json(
      {
        error: "Connexion indisponible. Vérifiez la configuration du serveur.",
      },
      { status: 503 },
    );
  }
}
