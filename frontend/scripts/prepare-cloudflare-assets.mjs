import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const frontendDir = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(frontendDir, "out");
const wrappedDir = join(outputDir, "wrapped");

await mkdir(wrappedDir, { recursive: true });
for (const entry of ["index.html", "index.txt", "404.html", "_next"]) {
  await cp(join(outputDir, entry), join(wrappedDir, entry), { recursive: true, force: true });
}
console.log("Prepared the static export under /wrapped for Cloudflare Assets.");
