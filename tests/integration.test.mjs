import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, access } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import { randomBytes, createHmac } from "node:crypto";
import { createClient } from "@libsql/client";
import { migrate } from "../scripts/migrate.mjs";
import { hashPassword } from "../scripts/password.mjs";

// A real Next.js production server and isolated SQLite/files. No real credentials.
test(
  "Local production workflow: authentication, CMS, forms, attachments and abuse protections",
  { timeout: 120000 },
  async (t) => {
    await access(".next/BUILD_ID").catch(() => {
      throw new Error("Exécutez npm run build avant npm test.");
    });
    const temp = await mkdtemp(path.join(os.tmpdir(), "lmhi-test-"));
    const password = randomBytes(20).toString("base64url");
    const formSecret = randomBytes(32).toString("hex");
    const listener = net.createServer();
    await new Promise((r) => listener.listen(0, "127.0.0.1", r));
    const port = listener.address().port;
    await new Promise((r) => listener.close(r));
    const base = "http://localhost:" + port;
    const env = {
      ...process.env,
      NODE_ENV: "production",
      DATABASE_URL: "file:" + path.join(temp, "test.db"),
      DATABASE_AUTH_TOKEN: "",
      STORAGE_DRIVER: "local",
      DATA_DIRECTORY: temp,
      ADMIN_EMAIL: "owner@example.test",
      ADMIN_PASSWORD_HASH: hashPassword(password),
      SESSION_SECRET: randomBytes(32).toString("hex"),
      FORM_SECRET: formSecret,
      APP_URL: base,
      VERCEL: "",
      VERCEL_URL: "",
      SITE_INDEXABLE: "false",
    };
    const previous = process.env.DATABASE_URL;
    process.env.DATABASE_URL = env.DATABASE_URL;
    await migrate();
    await migrate();
    if (previous) process.env.DATABASE_URL = previous;
    else delete process.env.DATABASE_URL;
    const server = spawn(
      process.execPath,
      [
        "node_modules/next/dist/bin/next",
        "start",
        "-p",
        String(port),
        "--hostname",
        "127.0.0.1",
      ],
      { env, stdio: ["ignore", "pipe", "pipe"] },
    );
    let output = "";
    server.stdout.on("data", (b) => (output += b));
    server.stderr.on("data", (b) => (output += b));
    const request = (route, options = {}) =>
      fetch(base + route, {
        ...options,
        headers: { Origin: base, ...options.headers },
      });
    const json = (route, data, cookie) =>
      request(route, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(cookie ? { cookie } : {}),
        },
        body: JSON.stringify(data),
      });
    const token = () => {
      const payload = Date.now() - 4000 + "." + crypto.randomUUID();
      return (
        payload +
        "." +
        createHmac("sha256", formSecret).update(payload).digest("hex")
      );
    };
    try {
      let ready = false;
      for (let i = 0; i < 100; i++) {
        if (server.exitCode !== null) throw new Error(output);
        try {
          if ((await request("/api/content")).ok) {
            ready = true;
            break;
          }
        } catch {}
        await new Promise((r) => setTimeout(r, 200));
      }
      assert.ok(ready, output);
      await t.test("FR/EN pages and privacy metadata", async () => {
        for (const route of [
          "/",
          "/en",
          "/a-propos",
          "/maritime",
          "/industrie-lourde",
          "/signalisation",
          "/securite",
          "/remorquage",
          "/main-doeuvre",
          "/projets",
          "/carrieres",
          "/partenaires",
          "/soumission",
          "/contact",
          "/confidentialite",
          "/gestion",
          "/en/carrieres",
        ]) {
          const r = await request(route);
          assert.equal(r.status, 200, route);
          assert.match(await r.text(), /LMHI/);
        }
        const html = await (await request("/")).text();
        assert.match(html, /noindex/);
      });
      let session;
      await t.test(
        "Administrator authentication rejects forged headers and bad passwords",
        async () => {
          assert.equal(
            (
              await request("/api/admin", {
                headers: {
                  "oai-authenticated-user-email": "owner@example.test",
                },
              })
            ).status,
            403,
          );
          assert.equal(
            (
              await request("/api/admin", {
                headers: { cookie: "lmhi_session=fake" },
              })
            ).status,
            403,
          );
          assert.equal(
            (
              await json("/api/auth/login", {
                email: "owner@example.test",
                password: "wrong",
              })
            ).status,
            401,
          );
          const r = await json("/api/auth/login", {
            email: "owner@example.test",
            password,
          });
          assert.equal(r.status, 200);
          const c = r.headers.get("set-cookie");
          assert.match(c, /HttpOnly/i);
          assert.match(c, /Secure/i);
          assert.match(c, /SameSite=strict/i);
          session = c.split(";")[0];
          assert.equal(
            (await request("/api/admin", { headers: { cookie: session } }))
              .status,
            200,
          );
        },
      );
      await t.test("CMS persists bilingual content", async () => {
        const settings = {
          aboutFr: "Présentation test",
          aboutEn: "Test introduction",
          jobs: [
            {
              id: "test-job",
              titleFr: "Soudeur",
              titleEn: "Welder",
              location: "Québec",
              bodyFr: "Description",
              bodyEn: "Description",
            },
          ],
        };
        assert.equal(
          (
            await json(
              "/api/admin",
              { action: "settings", data: settings },
              session,
            )
          ).status,
          200,
        );
        const saved = await (await request("/api/content")).json();
        for (const [key, value] of Object.entries(settings)) assert.deepEqual(saved[key], value);
        assert.equal(saved.founderName, "Joe Pharleys Longla Pafoule");
        assert.equal(saved.email, "longlajoe@gmail.com");
      });
      let firstId;
      let firstKey;
      for (const kind of ["quote", "career", "partner", "contact"])
        await t.test(
          "Submit " + kind + (kind === "quote" ? " with private PDF" : ""),
          async () => {
            const formToken = token();
            const form = new FormData();
            const data = {
              kind,
              token: formToken,
              consent: "yes",
              company: "Entreprise test",
              contact: "Responsable test",
              firstName: "Test",
              lastName: "Candidat",
              phone: "555-0100",
              email: "test@example.test",
              service: "Maritime",
              location: "Québec",
              date: "2026-11-01",
              description: "Test automatisé",
              trade: "Soudeur",
              experience: "2",
              availability: "Décembre",
            };
            for (const [k, v] of Object.entries(data)) form.set(k, v);
            if (kind === "quote") {
              const file = new File(["%PDF-1.4\nTest\n%%EOF"], "test.pdf", {
                type: "application/pdf",
              });
              const r = await json("/api/uploads/prepare", {
                name: file.name,
                size: file.size,
                token: formToken,
              });
              assert.equal(r.status, 200);
              const u = await r.json();
              firstKey = u.key;
              const upload = new FormData();
              upload.set("key", u.key);
              upload.set("ticket", u.ticket);
              upload.set("file", file);
              assert.equal(
                (
                  await request("/api/uploads/local", {
                    method: "POST",
                    body: upload,
                  })
                ).status,
                200,
              );
              form.set(
                "attachments",
                JSON.stringify([{ key: u.key, ticket: u.ticket }]),
              );
            }
            const r = await request("/api/submissions", {
              method: "POST",
              body: form,
            });
            assert.equal(r.status, 201, await r.clone().text());
            const result = await r.json();
            if (kind === "quote") firstId = result.id;
            assert.equal(
              (
                await request("/api/submissions", {
                  method: "POST",
                  body: form,
                })
              ).status,
              200,
              "same token is idempotent",
            );
          },
        );
      await t.test(
        "Private files are authorized and removed with their request",
        async () => {
          const uri = "/api/files?key=" + encodeURIComponent(firstKey);
          assert.equal((await request(uri)).status, 403);
          const r = await request(uri, { headers: { cookie: session } });
          assert.equal(r.status, 200);
          assert.match(await r.text(), /%PDF/);
          assert.equal(
            (
              await json(
                "/api/admin",
                { action: "delete", id: firstId },
                session,
              )
            ).status,
            200,
          );
          assert.equal(
            (await request(uri, { headers: { cookie: session } })).status,
            404,
          );
        },
      );
      await t.test(
        "Cross-origin, invalid tokens and unsupported uploads are rejected",
        async () => {
          const f = new FormData();
          f.set("token", "invalid");
          assert.equal(
            (await request("/api/submissions", { method: "POST", body: f }))
              .status,
            400,
          );
          assert.equal(
            (
              await request("/api/submissions", {
                method: "POST",
                headers: { Origin: "https://attacker.test" },
                body: f,
              })
            ).status,
            403,
          );
          assert.equal(
            (
              await json("/api/uploads/prepare", {
                name: "bad.exe",
                size: 10,
                token: token(),
              })
            ).status,
            400,
          );
          assert.equal(
            (
              await json("/api/uploads/prepare", {
                name: "big.pdf",
                size: 11 * 1024 * 1024,
                token: token(),
              })
            ).status,
            400,
          );
        },
      );
      await t.test("Logout clears the cookie", async () => {
        const r = await request("/api/auth/logout", {
          method: "POST",
          headers: { cookie: session },
        });
        assert.equal(r.status, 200);
        assert.match(r.headers.get("set-cookie"), /Max-Age=0/i);
      });
    } finally {
      server.kill("SIGTERM");
      if (server.exitCode === null) await once(server, "exit");
      await rm(temp, { recursive: true, force: true });
    }
  },
);
