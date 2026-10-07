import { SignJWT, jwtVerify } from "jose";
import {
  createHash,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
export const cookieName = "lmhi_session";
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32)
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  return new TextEncoder().encode(value);
}
function credentialVersion() {
  return createHash("sha256")
    .update(process.env.ADMIN_PASSWORD_HASH || "")
    .digest("hex");
}
export async function passwordMatches(password: string) {
  const [salt, hash] = String(process.env.ADMIN_PASSWORD_HASH || "").split(":");
  if (!salt || !hash || password.length > 256) return false;
  const actual = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export async function createSession() {
  return new SignJWT({ role: "admin", version: credentialVersion() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("lmhi-canada")
    .setAudience("lmhi-admin")
    .setSubject(process.env.ADMIN_EMAIL!.toLowerCase())
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret());
}
export async function admin(request: Request) {
  try {
    const raw = request.headers.get("cookie") || "";
    const token = raw
      .split(";")
      .map((x) => x.trim())
      .find((x) => x.startsWith(cookieName + "="))
      ?.slice(cookieName.length + 1);
    if (!token) return false;
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
      issuer: "lmhi-canada",
      audience: "lmhi-admin",
    });
    return (
      payload.role === "admin" &&
      payload.sub === process.env.ADMIN_EMAIL?.toLowerCase() &&
      payload.version === credentialVersion()
    );
  } catch {
    return false;
  }
}
