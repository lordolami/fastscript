import { ensureDesignSystem } from "../src/style-system.mjs";

const out = ensureDesignSystem({ root: process.cwd() });
console.log(`style generate: wrote ${out.generatedPath}`);
