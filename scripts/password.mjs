import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
export function hashPassword(password) {
  if (password.length < 12 || password.length > 256)
    throw new Error("Choisissez un mot de passe de 12 à 256 caractères.");
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
if (process.argv[1]?.endsWith("password.mjs")) {
  let muted = false;
  const output = new Writable({
    write(chunk, encoding, callback) {
      if (!muted) process.stdout.write(chunk, encoding);
      callback();
    },
  });
  const rl = createInterface({
    input: process.stdin,
    output,
    terminal: !!process.stdin.isTTY,
  });
  process.stdout.write(
    "Nouveau mot de passe (12 caractères minimum, saisie masquée) : ",
  );
  muted = true;
  const password = await rl.question("");
  muted = false;
  rl.close();
  console.log("\nADMIN_PASSWORD_HASH=" + hashPassword(password));
  console.log(
    "Copiez cette valeur dans .env.local ou dans les variables Vercel, puis redémarrez/redéployez. Les anciennes sessions seront invalidées.",
  );
}
