import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const releaseRoot = resolve(".release", "slots");
const liveFile = resolve(".release", "live-slot.txt");
mkdirSync(releaseRoot, { recursive: true });

const live = existsSync(liveFile) ? readFileSync(liveFile, "utf8").trim() : "blue";
const next = live === "blue" ? "green" : "blue";
const targetDir = join(releaseRoot, next);
mkdirSync(targetDir, { recursive: true });

cpSync(resolve("dist"), join(targetDir, "dist"), { recursive: true });
writeFileSync(join(targetDir, "health.json"), JSON.stringify({ ok: true, deployedAt: new Date().toISOString() }, null, 2), "utf8");
writeFileSync(liveFile, next, "utf8");

console.log(`zero-downtime deploy slot switched: ${live} -> ${next}`);
