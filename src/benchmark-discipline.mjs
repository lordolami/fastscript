import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function assertField(condition, message) {
  if (!condition) throw new Error(message);
}

export async function runBenchmarkDiscipline({ suitePath = resolve("benchmarks", "suite-latest.json") } = {}) {
  assertField(existsSync(suitePath), `missing benchmark suite: ${suitePath}`);
  const suite = JSON.parse(readFileSync(suitePath, "utf8"));

  assertField(suite.protocol && typeof suite.protocol === "object", "suite protocol missing");
  assertField(Number.isFinite(suite.protocol.runs) && suite.protocol.runs >= 3, "protocol.runs must be >= 3");
  assertField(Number.isFinite(suite.protocol.sampleIntervalMs) && suite.protocol.sampleIntervalMs > 0, "protocol.sampleIntervalMs invalid");

  assertField(suite.environment && typeof suite.environment === "object", "suite environment missing");
  for (const key of ["node", "platform", "arch", "cpuModel", "cpuCount", "totalMemoryMb"]) {
    assertField(Boolean(suite.environment[key] || suite.environment[key] === 0), `suite environment missing ${key}`);
  }

  assertField(Array.isArray(suite.corpora) && suite.corpora.length > 0, "suite corpora missing");

  for (const corpus of suite.corpora) {
    if (corpus.skipped) continue;
    assertField(Boolean(corpus.id), "corpus id missing");
    assertField(Boolean(corpus.root), `corpus root missing for ${corpus.id}`);
    assertField(Number.isFinite(corpus?.timingsMs?.buildCold?.ms), `corpus buildCold invalid for ${corpus.id}`);
    assertField(Number.isFinite(corpus?.timingsMs?.buildWarm?.p95Trimmed), `corpus buildWarm p95Trimmed invalid for ${corpus.id}`);
    assertField(Number.isFinite(corpus?.timingsMs?.typecheck?.p95Trimmed), `corpus typecheck p95Trimmed invalid for ${corpus.id}`);
    assertField(Number.isFinite(corpus?.bundles?.js) && Number.isFinite(corpus?.bundles?.css), `corpus bundle sizes invalid for ${corpus.id}`);

    const hard = corpus.hardLimitCheck || {};
    for (const key of ["parsePerFileUnder100ms", "typecheckPer100FilesUnder500ms", "warmBuildUnder2000ms", "coldBuildUnder5000ms", "firstLoadJsUnder5kb"]) {
      assertField(typeof hard[key] === "boolean" || hard[key] === null, `corpus hardLimitCheck.${key} invalid for ${corpus.id}`);
    }
  }

  console.log("benchmark discipline pass");
}
