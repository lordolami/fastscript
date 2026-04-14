import { runRetentionSweep } from "../src/retention.mjs";

const result = runRetentionSweep({ root: ".fastscript" });
console.log(`retention sweep: ${JSON.stringify(result)}`);
