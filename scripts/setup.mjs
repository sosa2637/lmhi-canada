import { access, writeFile, mkdir } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { hashPassword } from "./password.mjs";
import { migrate } from "./migrate.mjs";
try {
  await access(".env.local");
  console.log(
    ".env.local existe déjà : aucune valeur écrasée. Lancez npm run db:migrate si nécessaire.",
  );
  process.exit(0);
} catch {}
let email = "admin@example.test";
if (!process.argv.includes("--non-interactive")) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  email = (await rl.question("Courriel du compte administrateur : ")).trim();
  rl.close();
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  throw new Error("Courriel invalide.");
const password = randomBytes(18).toString("base64url");
const values = {
  DATABASE_URL: "file:./data/lmhi.db",
  DATABASE_AUTH_TOKEN: "",
  STORAGE_DRIVER: "local",
  BLOB_READ_WRITE_TOKEN: "",
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD_HASH: hashPassword(password),
  SESSION_SECRET: randomBytes(32).toString("hex"),
  FORM_SECRET: randomBytes(32).toString("hex"),
  APP_URL: "http://localhost:3000",
  SITE_INDEXABLE: "false",
};
await mkdir("data", { recursive: true });
await writeFile(
  ".env.local",
  Object.entries(values)
    .map(([k, v]) => k + "=" + JSON.stringify(v))
    .join("\n") + "\n",
  { mode: 0o600, flag: "wx" },
);
Object.assign(process.env, values);
await migrate();
console.log("Configuration locale créée.");
console.log("Compte : " + email);
console.log("Mot de passe généré (à conserver) : " + password);
console.log("Lancez npm run dev puis ouvrez http://localhost:3000/gestion");
