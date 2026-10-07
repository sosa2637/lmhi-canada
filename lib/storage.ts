import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { put, get, del, head } from "@vercel/blob";
export function cloudStorage() {
  return process.env.STORAGE_DRIVER === "vercel";
}
function localPath(key: string) {
  if (process.env.VERCEL)
    throw new Error("STORAGE_DRIVER=vercel required on Vercel");
  if (!/^[a-zA-Z0-9/_-]+$/.test(key) || key.includes(".."))
    throw new Error("Invalid storage key");
  return path.join(
    process.env.DATA_DIRECTORY || path.join(process.cwd(), "data"),
    "uploads",
    key,
  );
}
export function bucket() {
  return {
    async put(
      key: string,
      bytes: ArrayBuffer,
      options?: { httpMetadata?: { contentType: string } },
    ) {
      if (cloudStorage())
        return put(key, bytes, {
          access: "private",
          addRandomSuffix: false,
          contentType:
            options?.httpMetadata?.contentType || "application/octet-stream",
        });
      const target = localPath(key);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, Buffer.from(bytes));
    },
    async get(key: string) {
      if (cloudStorage()) {
        const result = await get(key, { access: "private" });
        return result && result.statusCode === 200
          ? { body: result.stream }
          : null;
      }
      try {
        const bytes = await readFile(localPath(key));
        return { body: new Uint8Array(bytes) };
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw e;
      }
    },
    async delete(key: string) {
      if (cloudStorage()) return del(key);
      try {
        await unlink(localPath(key));
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
      }
    },
    async info(key: string) {
      if (cloudStorage()) {
        const h = await head(key);
        return { size: h.size };
      }
      const b = await readFile(localPath(key));
      return { size: b.length };
    },
  };
}
