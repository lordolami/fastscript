import { ensureDesignSystem, validateAppStyles } from "../src/style-system.mjs";

ensureDesignSystem({ root: process.cwd() });
validateAppStyles({ root: process.cwd() });
console.log("style check passed");
