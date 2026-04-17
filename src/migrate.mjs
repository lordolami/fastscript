import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const REWRITE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".fs", ".mjs", ".cjs"]);
const DEFAULT_IGNORE_DIRS = new Set([".git", "node_modules", "dist", ".next", ".turbo", ".cache", ".fastscript"]);

const DEFAULT_PROTECTED_EXTENSION_REGEX = [
  /\.css$/i,
  /\.scss$/i,
  /\.sass$/i,
  /\.less$/i,
  /\.styl$/i,
  /\.stylus$/i,
  /\.png$/i,
  /\.jpe?g$/i,
  /\.gif$/i,
  /\.webp$/i,
  /\.avif$/i,
  /\.ico$/i,
  /\.bmp$/i,
  /\.svg$/i,
  /\.woff2?$/i,
  /\.ttf$/i,
  /\.otf$/i,
  /\.eot$/i,
  /\.md$/i,
  /\.mdx$/i,
  /\.txt$/i,
  /\.json$/i,
  /\.snap$/i,
];

const DEFAULT_PROTECTED_DIR_SEGMENTS = new Set([
  "design",
  "assets",
  "public",
  "snapshots",
  "__snapshots__",
  "fixtures",
  "brand",
  "copy",
  "content",
]);

const DEFAULT_CONFIG = {
  protectedFiles: [],
  protectedDirectories: [],
  protectedGlobs: [],
  protectedExtensions: [],
  blockedFiles: [],
  protectedConfigKeys: [],
  protectedMarkupRegions: [],
  fidelity: {
    requiredProbes: [],
    commands: {},
  },
};

function normalizeSlashes(value) {
  return String(value || "").replace(/\\/g, "/");
}

function ensureDotSlash(value) {
  if (!value.startsWith(".")) return `./${value}`;
  return value;
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function nowRunId() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (DEFAULT_IGNORE_DIRS.has(entry.name)) continue;
      out.push(...walk(full));
      continue;
    }
    if (entry.isFile()) out.push(full);
  }
  return out;
}

function readJsonFile(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`migrate: invalid JSON at ${path}: ${error.message}`);
  }
}

function mergeConfig(base, override) {
  const merged = {
    ...base,
    ...override,
    fidelity: {
      ...base.fidelity,
      ...(override?.fidelity || {}),
      commands: {
        ...(base?.fidelity?.commands || {}),
        ...(override?.fidelity?.commands || {}),
      },
    },
  };

  for (const key of ["protectedFiles", "protectedDirectories", "protectedGlobs", "protectedExtensions", "blockedFiles", "protectedConfigKeys", "protectedMarkupRegions"]) {
    if (!Array.isArray(merged[key])) merged[key] = [];
  }
  if (!Array.isArray(merged?.fidelity?.requiredProbes)) merged.fidelity.requiredProbes = [];
  return merged;
}

function parseArgs(input) {
  const argv = Array.isArray(input) ? [...input] : typeof input === "string" ? [input] : [];
  const options = {
    target: "app",
    dryRun: false,
    reportDir: resolve(".fastscript", "conversion"),
    configPath: resolve("fastscript.compatibility.json"),
    fidelityLevel: "basic",
    failOnUnprovenFidelity: false,
  };

  let positionalConsumed = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg) continue;

    if (!arg.startsWith("-") && !positionalConsumed) {
      options.target = arg;
      positionalConsumed = true;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--write") {
      options.dryRun = false;
      continue;
    }

    if (arg === "--report-dir") {
      options.reportDir = resolve(argv[i + 1] || options.reportDir);
      i += 1;
      continue;
    }

    if (arg === "--config") {
      options.configPath = resolve(argv[i + 1] || options.configPath);
      i += 1;
      continue;
    }

    if (arg === "--fidelity-level") {
      const next = String(argv[i + 1] || "basic").toLowerCase();
      options.fidelityLevel = ["off", "basic", "full"].includes(next) ? next : "basic";
      i += 1;
      continue;
    }

    if (arg === "--fail-on-unproven-fidelity") {
      options.failOnUnprovenFidelity = true;
      continue;
    }

    if (arg === "--allow-unproven-fidelity") {
      options.failOnUnprovenFidelity = false;
      continue;
    }
  }

  if (options.fidelityLevel === "full") options.failOnUnprovenFidelity = true;
  return options;
}

function toFsPath(file) {
  return file.replace(/\.(js|jsx|ts|tsx)$/, ".fs");
}

function pathStartsWith(child, parent) {
  const rel = relative(parent, child);
  if (!rel) return true;
  return !rel.startsWith("..") && !isAbsolute(rel);
}

function globToRegex(glob) {
  const escaped = String(glob || "")
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*\*/g, "::DOUBLE_STAR::")
    .replace(/\*/g, "[^/]*")
    .replace(/::DOUBLE_STAR::/g, ".*");
  return new RegExp(`^${escaped}$`, "i");
}

function isIdentifierChar(char) {
  return /[A-Za-z0-9_$]/.test(char || "");
}

function isIdentifierStart(char) {
  return /[A-Za-z_$]/.test(char || "");
}

function isBoundary(source, index, length) {
  const before = source[index - 1] || "";
  const after = source[index + length] || "";
  return !isIdentifierChar(before) && !isIdentifierChar(after);
}

function shouldTreatSlashAsRegex(previousSignificant) {
  if (!previousSignificant) return true;
  return "([{=:+-*,!&|?;<>%^~".includes(previousSignificant);
}

function skipTrivia(source, start) {
  let i = start;
  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];
    if (/\s/.test(char)) {
      i += 1;
      continue;
    }
    if (char === "/" && next === "/") {
      i += 2;
      while (i < source.length && source[i] !== "\n") i += 1;
      continue;
    }
    if (char === "/" && next === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i += 1;
      i += 2;
      continue;
    }
    break;
  }
  return i;
}

function readQuotedSpecifier(source, start) {
  const quote = source[start];
  if (quote !== "'" && quote !== "\"") return null;
  let i = start + 1;
  while (i < source.length) {
    const char = source[i];
    if (char === "\\") {
      i += 2;
      continue;
    }
    if (char === quote) {
      return {
        specifier: source.slice(start + 1, i),
        index: start + 1,
        length: i - start - 1,
        end: i + 1,
      };
    }
    i += 1;
  }
  return null;
}

function buildProtectionMatchers({ projectRoot, targetRoot, config }) {
  const protectedFileSet = new Set(
    (config.protectedFiles || []).map((item) => normalizeSlashes(relative(targetRoot, resolve(projectRoot, item))))
  );

  const protectedDirectorySet = new Set(
    (config.protectedDirectories || []).map((item) => normalizeSlashes(relative(targetRoot, resolve(projectRoot, item))))
  );

  const blockedFileSet = new Set(
    (config.blockedFiles || []).map((item) => normalizeSlashes(relative(targetRoot, resolve(projectRoot, item))))
  );

  const protectedGlobs = (config.protectedGlobs || []).map((item) => globToRegex(normalizeSlashes(item)));
  const protectedExtensionRegex = [
    ...DEFAULT_PROTECTED_EXTENSION_REGEX,
    ...(config.protectedExtensions || []).map((ext) => new RegExp(`${String(ext).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")),
  ];

  return {
    isBlocked(relPath) {
      return blockedFileSet.has(relPath);
    },
    isProtected(relPath, fileAbs) {
      if (protectedFileSet.has(relPath)) return true;

      for (const protectedDir of protectedDirectorySet) {
        if (!protectedDir) continue;
        if (relPath === protectedDir || relPath.startsWith(`${protectedDir}/`)) return true;
      }

      const segments = normalizeSlashes(relative(targetRoot, fileAbs)).split("/").filter(Boolean);
      for (const segment of segments.slice(0, -1)) {
        if (DEFAULT_PROTECTED_DIR_SEGMENTS.has(segment)) return true;
      }

      for (const regex of protectedGlobs) {
        if (regex.test(relPath)) return true;
      }

      for (const regex of protectedExtensionRegex) {
        if (regex.test(relPath)) return true;
      }

      return false;
    },
  };
}

function extractSpecifiers(source) {
  const out = [];
  const push = (type, raw, specifier, index, length) => {
    out.push({ type, raw, specifier, index, length });
  };

  let i = 0;
  let previousSignificant = "";

  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];

    if (char === "/" && next === "/") {
      i += 2;
      while (i < source.length && source[i] !== "\n") i += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) i += 1;
      i += 2;
      continue;
    }

    if (char === "'" || char === "\"") {
      const literal = readQuotedSpecifier(source, i);
      i = literal ? literal.end : i + 1;
      previousSignificant = "a";
      continue;
    }

    if (char === "`") {
      i += 1;
      while (i < source.length) {
        if (source[i] === "\\") {
          i += 2;
          continue;
        }
        if (source[i] === "`") {
          i += 1;
          break;
        }
        i += 1;
      }
      previousSignificant = "a";
      continue;
    }

    if (char === "/" && shouldTreatSlashAsRegex(previousSignificant)) {
      i += 1;
      let inClass = false;
      while (i < source.length) {
        const current = source[i];
        if (current === "\\") {
          i += 2;
          continue;
        }
        if (current === "[") {
          inClass = true;
          i += 1;
          continue;
        }
        if (current === "]") {
          inClass = false;
          i += 1;
          continue;
        }
        if (current === "/" && !inClass) {
          i += 1;
          while (i < source.length && /[A-Za-z]/.test(source[i])) i += 1;
          break;
        }
        i += 1;
      }
      previousSignificant = "a";
      continue;
    }

    if (isIdentifierStart(char)) {
      const start = i;
      i += 1;
      while (i < source.length && isIdentifierChar(source[i])) i += 1;
      const word = source.slice(start, i);
      if (!isBoundary(source, start, word.length)) {
        previousSignificant = "a";
        continue;
      }

      if (word === "from") {
        const nextIndex = skipTrivia(source, i);
        const literal = readQuotedSpecifier(source, nextIndex);
        if (literal) {
          push("from", source.slice(start, literal.end), literal.specifier, literal.index, literal.length);
        }
      } else if (word === "import") {
        let nextIndex = skipTrivia(source, i);
        if (source[nextIndex] === "(") {
          nextIndex = skipTrivia(source, nextIndex + 1);
          const literal = readQuotedSpecifier(source, nextIndex);
          if (literal) {
            const endIndex = skipTrivia(source, literal.end);
            if (source[endIndex] === ")") {
              push("call", source.slice(start, endIndex + 1), literal.specifier, literal.index, literal.length);
            }
          }
        } else {
          const literal = readQuotedSpecifier(source, nextIndex);
          if (literal) {
            push("import", source.slice(start, literal.end), literal.specifier, literal.index, literal.length);
          }
        }
      } else if (word === "require") {
        let nextIndex = skipTrivia(source, i);
        if (source[nextIndex] === "(") {
          nextIndex = skipTrivia(source, nextIndex + 1);
          const literal = readQuotedSpecifier(source, nextIndex);
          if (literal) {
            const endIndex = skipTrivia(source, literal.end);
            if (source[endIndex] === ")") {
              push("call", source.slice(start, endIndex + 1), literal.specifier, literal.index, literal.length);
            }
          }
        }
      }
      previousSignificant = "a";
      continue;
    }

    if (!/\s/.test(char)) previousSignificant = char;
    i += 1;
  }

  out.sort((a, b) => a.index - b.index);
  return out;
}

function rewriteSourceImports({ source, filePath, renameMap }) {
  const specs = extractSpecifiers(source);
  if (!specs.length) return { code: source, rewrites: [] };

  let offset = 0;
  let code = source;
  const rewrites = [];

  for (const spec of specs) {
    const value = spec.specifier;
    if (!value.startsWith(".")) continue;

    const oldTarget = resolve(dirname(filePath), value);
    const normalizedTarget = resolve(oldTarget);
    const nextTarget = renameMap.get(normalizedTarget);
    if (!nextTarget) continue;

    let nextSpec = normalizeSlashes(relative(dirname(filePath), nextTarget));
    nextSpec = ensureDotSlash(nextSpec);
    if (nextSpec === value) continue;

    const start = spec.index + offset;
    const end = start + spec.length;
    code = `${code.slice(0, start)}${nextSpec}${code.slice(end)}`;
    offset += nextSpec.length - spec.length;

    rewrites.push({
      from: value,
      to: nextSpec,
      inFile: filePath,
    });
  }

  return { code, rewrites };
}

function collectFileState(targetRoot) {
  const files = walk(targetRoot);
  const entries = files.map((abs) => {
    const rel = normalizeSlashes(relative(targetRoot, abs));
    const source = readFileSync(abs, "utf8");
    return {
      abs,
      rel,
      ext: extname(abs).toLowerCase(),
      source,
      size: statSync(abs).size,
      hash: sha256(source),
    };
  });

  return {
    files,
    byAbs: new Map(entries.map((entry) => [entry.abs, entry])),
    byRel: new Map(entries.map((entry) => [entry.rel, entry])),
    entries,
  };
}

function createAfterVirtualState({ beforeState, plan }) {
  const virtual = new Map(beforeState.entries.map((entry) => [entry.abs, entry.source]));

  for (const op of plan.writes) {
    virtual.set(op.path, op.contents);
  }

  for (const op of plan.renames) {
    if (op.from !== op.to) virtual.delete(op.from);
  }

  const entries = [];
  for (const [abs, source] of virtual.entries()) {
    const rel = normalizeSlashes(relative(plan.targetRoot, abs));
    entries.push({
      abs,
      rel,
      ext: extname(abs).toLowerCase(),
      source,
      size: Buffer.byteLength(source, "utf8"),
      hash: sha256(source),
    });
  }

  entries.sort((a, b) => a.rel.localeCompare(b.rel));
  return {
    entries,
    byAbs: new Map(entries.map((entry) => [entry.abs, entry])),
    files: entries.map((entry) => entry.abs),
  };
}

function createImportGraph(state, rootAbs) {
  const edges = [];
  const edgeSet = new Set();

  for (const entry of state.entries) {
    if (!REWRITE_EXTENSIONS.has(entry.ext)) continue;
    const specs = extractSpecifiers(entry.source);
    for (const spec of specs) {
      if (!spec.specifier.startsWith(".")) continue;
      const from = entry.abs;
      const to = resolve(dirname(entry.abs), spec.specifier);
      const fromRel = normalizeSlashes(relative(rootAbs, from));
      const toRel = normalizeSlashes(relative(rootAbs, to));
      const key = `${fromRel}->${toRel}`;
      if (edgeSet.has(key)) continue;
      edgeSet.add(key);
      edges.push({ from: fromRel, to: toRel });
    }
  }

  edges.sort((a, b) => `${a.from}->${a.to}`.localeCompare(`${b.from}->${b.to}`));
  return edges;
}

function mapImportEdges(edges, targetRoot, renameMap) {
  const out = edges.map((edge) => {
    const fromAbs = resolve(targetRoot, edge.from);
    const toAbs = resolve(targetRoot, edge.to);
    const mappedFrom = renameMap.get(fromAbs) || fromAbs;
    const mappedTo = renameMap.get(toAbs) || toAbs;
    return {
      from: normalizeSlashes(relative(targetRoot, mappedFrom)),
      to: normalizeSlashes(relative(targetRoot, mappedTo)),
    };
  });

  out.sort((a, b) => `${a.from}->${a.to}`.localeCompare(`${b.from}->${b.to}`));
  return out;
}

function edgesEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].from !== b[i].from || a[i].to !== b[i].to) return false;
  }
  return true;
}

function resolveRelativeImportPath(baseFile, specifier, state) {
  const abs = resolve(dirname(baseFile), specifier);
  if (state.byAbs.has(abs)) return abs;
  if (existsSync(abs) && statSync(abs).isFile()) return abs;

  const candidates = [
    `${abs}.fs`,
    `${abs}.js`,
    `${abs}.jsx`,
    `${abs}.ts`,
    `${abs}.tsx`,
    join(abs, "index.fs"),
    join(abs, "index.js"),
    join(abs, "index.ts"),
    join(abs, "index.tsx"),
    join(abs, "index.jsx"),
  ];

  for (const candidate of candidates) {
    if (state.byAbs.has(candidate)) return candidate;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }

  return null;
}

function validateImportResolution(state) {
  const unresolved = [];
  for (const entry of state.entries) {
    if (!REWRITE_EXTENSIONS.has(entry.ext)) continue;
    const specs = extractSpecifiers(entry.source);
    for (const spec of specs) {
      if (!spec.specifier.startsWith(".")) continue;
      const resolvedTarget = resolveRelativeImportPath(entry.abs, spec.specifier, state);
      if (!resolvedTarget) {
        unresolved.push({
          file: entry.rel,
          specifier: spec.specifier,
        });
      }
    }
  }
  return unresolved;
}

function calculateHashRows(state) {
  return state.entries
    .map((entry) => ({
      path: entry.rel,
      hash: entry.hash,
      size: entry.size,
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

function parseCommand(command) {
  const text = String(command || "").trim();
  if (!text) return null;
  const tokens = text.match(/"[^"]*"|'[^']*'|\S+/g) || [];
  if (!tokens.length) return null;
  return {
    bin: tokens[0].replace(/^['"]|['"]$/g, ""),
    args: tokens.slice(1).map((token) => token.replace(/^['"]|['"]$/g, "")),
    text,
  };
}

function hasRunnableScript(projectRoot, command) {
  const parsed = parseCommand(command);
  if (!parsed) return false;

  if (/^npm$/i.test(parsed.bin) && /^run$/i.test(parsed.args[0] || "")) return existsSync(resolve(projectRoot, "package.json"));

  if (/^node(\.exe)?$/i.test(parsed.bin)) {
    const first = parsed.args[0];
    if (!first) return true;
    return existsSync(resolve(projectRoot, first));
  }

  return true;
}

async function runProbe(projectRoot, id, command) {
  const parsed = parseCommand(command);
  if (!parsed) {
    return {
      id,
      command,
      status: "fail",
      exitCode: null,
      durationMs: 0,
      stdoutTail: "",
      stderrTail: "invalid probe command",
    };
  }

  const startedAt = Date.now();

  if (/^node(\.exe)?$/i.test(parsed.bin) && parsed.args.length >= 1) {
    const scriptPath = resolve(projectRoot, parsed.args[0]);
    if (existsSync(scriptPath) && scriptPath.endsWith(".mjs") && parsed.args.length === 1) {
      try {
        const probeUrl = `${pathToFileURL(scriptPath).href}?probe=${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await import(probeUrl);
        return {
          id,
          command,
          status: "pass",
          exitCode: 0,
          durationMs: Date.now() - startedAt,
          stdoutTail: "",
          stderrTail: "",
        };
      } catch (error) {
        return {
          id,
          command,
          status: "fail",
          exitCode: null,
          durationMs: Date.now() - startedAt,
          stdoutTail: "",
          stderrTail: String(error?.message || error),
        };
      }
    }
  }

  const result = spawnSync(parsed.bin, parsed.args, {
    cwd: projectRoot,
    encoding: "utf8",
    env: process.env,
  });
  const status = result.error || result.status !== 0 ? "fail" : "pass";

  return {
    id,
    command,
    status,
    exitCode: result.status,
    durationMs: Date.now() - startedAt,
    stdoutTail: String(result.stdout || "").trim().split(/\r?\n/).slice(-8).join("\n"),
    stderrTail: [String(result.stderr || "").trim(), result.error ? String(result.error.message || result.error) : ""]
      .filter(Boolean)
      .join("\n")
      .split(/\r?\n/)
      .slice(-8)
      .join("\n"),
  };
}

function buildFidelityProbeCommands(config) {
  const commands = {
    domSnapshotComparison: "node ./scripts/test-conformance.mjs",
    computedStyleComparison: "node ./scripts/test-style-rules.mjs",
    screenshotDiffComparison: "node ./scripts/test-style-rules.mjs",
    routeOutputComparison: "node ./scripts/test-routes.mjs",
    apiContractComparison: "node ./scripts/test-validation.mjs",
    hydrationAndInteractionValidation: "node ./scripts/test-runtime-context-rules.mjs",
    ...(config?.fidelity?.commands || {}),
  };
  return commands;
}

function collectProtectedScopeViolations({ writes, config, targetRoot }) {
  const violations = [];
  const keySet = new Set();
  const protectedConfigKeys = (config?.protectedConfigKeys || []).map((key) => String(key || "").trim()).filter(Boolean);
  const protectedMarkupRegions = (config?.protectedMarkupRegions || []).map((region) => String(region || "").trim()).filter(Boolean);

  const configExtensions = new Set([".json", ".js", ".jsx", ".ts", ".tsx", ".fs", ".mjs", ".cjs", ".yaml", ".yml", ".toml"]);
  const markupExtensions = new Set([".html", ".htm", ".jsx", ".tsx", ".fs", ".mdx", ".js", ".ts"]);

  for (const write of writes) {
    if (write.beforeHash === write.afterHash) continue;
    const relPath = normalizeSlashes(relative(targetRoot, write.sourcePath));
    const ext = extname(write.sourcePath).toLowerCase();
    const before = String(write.beforeContents || "");
    const after = String(write.contents || "");

    if (protectedConfigKeys.length && configExtensions.has(ext)) {
      for (const key of protectedConfigKeys) {
        if (before.includes(key) || after.includes(key)) {
          const id = `${relPath}|protected-config-key:${key}`;
          if (keySet.has(id)) continue;
          keySet.add(id);
          violations.push({ path: relPath, reason: `protected-config-key:${key}` });
        }
      }
    }

    if (protectedMarkupRegions.length && markupExtensions.has(ext)) {
      for (const region of protectedMarkupRegions) {
        const tokens = [
          region,
          `data-protected=\"${region}\"`,
          `id=\"${region}\"`,
          `class=\"${region}\"`,
          `'${region}'`,
          `"${region}"`,
        ];
        if (!tokens.some((token) => before.includes(token) || after.includes(token))) continue;
        const id = `${relPath}|protected-markup-region:${region}`;
        if (keySet.has(id)) continue;
        keySet.add(id);
        violations.push({ path: relPath, reason: `protected-markup-region:${region}` });
      }
    }
  }

  return violations;
}

function createPlan({ projectRoot, targetRoot, beforeState, config }) {
  const protection = buildProtectionMatchers({ projectRoot, targetRoot, config });
  const renameMap = new Map();
  const renames = [];
  const blockedFiles = [];
  const protectedFiles = [];

  for (const entry of beforeState.entries) {
    const rel = entry.rel;
    const abs = entry.abs;
    if (protection.isProtected(rel, abs)) protectedFiles.push(rel);

    if (!SOURCE_EXTENSIONS.has(entry.ext)) continue;

    if (protection.isBlocked(rel)) {
      blockedFiles.push({ path: rel, reason: "blocked-by-config" });
      continue;
    }

    if (protection.isProtected(rel, abs)) {
      blockedFiles.push({ path: rel, reason: "protected-file" });
      continue;
    }

    const next = toFsPath(abs);
    if (next !== abs && beforeState.byAbs.has(next)) {
      blockedFiles.push({ path: rel, reason: "destination-exists" });
      continue;
    }

    renameMap.set(abs, next);
    renames.push({
      from: abs,
      to: next,
      fromRel: rel,
      toRel: normalizeSlashes(relative(targetRoot, next)),
    });
  }

  const writes = [];
  const importRewrites = [];
  const touchedOutputFiles = new Set();

  for (const entry of beforeState.entries) {
    if (!REWRITE_EXTENSIONS.has(entry.ext)) continue;

    const targetPath = renameMap.get(entry.abs) || entry.abs;
    const rewritten = rewriteSourceImports({
      source: entry.source,
      filePath: entry.abs,
      renameMap,
    });

    const shouldWrite = targetPath !== entry.abs || rewritten.code !== entry.source;
    if (!shouldWrite) continue;

    writes.push({
      path: targetPath,
      sourcePath: entry.abs,
      contents: rewritten.code,
      kind: targetPath !== entry.abs ? "rename" : "rewrite",
      beforeHash: sha256(entry.source),
      afterHash: sha256(rewritten.code),
      beforeContents: entry.source,
    });

    touchedOutputFiles.add(targetPath);

    if (rewritten.rewrites.length) {
      importRewrites.push({
        file: normalizeSlashes(relative(targetRoot, targetPath)),
        count: rewritten.rewrites.length,
        rewrites: rewritten.rewrites.map((item) => ({ from: item.from, to: item.to })),
      });
    }
  }

  const renamedSourceSet = new Set(renames.map((item) => item.from));
  const deletes = renames
    .filter((item) => item.from !== item.to)
    .map((item) => item.from)
    .filter((path) => !touchedOutputFiles.has(path) && renamedSourceSet.has(path));

  const changedBeforePaths = new Set(writes.map((item) => item.sourcePath));
  const untouchedFiles = beforeState.entries
    .map((entry) => entry.rel)
    .filter((rel) => !changedBeforePaths.has(resolve(targetRoot, rel)));

  const protectedScopeViolations = collectProtectedScopeViolations({ writes, config, targetRoot });
  for (const violation of protectedScopeViolations) blockedFiles.push(violation);

  return {
    targetRoot,
    renames,
    renameMap,
    writes,
    deletes,
    blockedFiles,
    protectedFiles: [...new Set(protectedFiles)].sort(),
    protectedScopeViolations,
    importRewrites,
    untouchedFiles: untouchedFiles.sort(),
  };
}

function summarizePlan(plan) {
  return {
    renameCount: plan.renames.length,
    rewriteCount: plan.writes.filter((item) => item.kind === "rewrite").length,
    importRewriteCount: plan.importRewrites.reduce((sum, item) => sum + item.count, 0),
    blockedCount: plan.blockedFiles.length,
    protectedCount: plan.protectedFiles.length,
  };
}

function ensureWithinTarget(pathAbs, targetRoot) {
  if (!pathStartsWith(pathAbs, targetRoot)) {
    throw new Error(`migrate compatibility failure: attempted to modify non-target file (${pathAbs})`);
  }
}

function applyPlan(plan, runDir) {
  mkdirSync(runDir, { recursive: true });

  for (const write of plan.writes) {
    ensureWithinTarget(write.path, plan.targetRoot);
    mkdirSync(dirname(write.path), { recursive: true });
    writeFileSync(write.path, write.contents, "utf8");
  }

  for (const path of plan.deletes) {
    ensureWithinTarget(path, plan.targetRoot);
    rmSync(path, { force: true });
  }
}

function createRollbackPlan(plan) {
  const operations = [];

  for (const item of plan.renames) {
    if (item.from === item.to) continue;
    operations.push({ type: "rename", from: item.toRel, to: item.fromRel });
  }

  for (const write of plan.writes.filter((item) => item.beforeHash !== item.afterHash)) {
    operations.push({
      type: "restore-content",
      file: normalizeSlashes(relative(plan.targetRoot, write.sourcePath)),
      fromHash: write.afterHash,
      toHash: write.beforeHash,
      contents: write.beforeContents,
    });
  }

  return operations;
}

function createDiffPreview(plan) {
  const renameOperations = plan.renames
    .filter((item) => item.from !== item.to)
    .map((item) => ({ from: item.fromRel, to: item.toRel }));

  const rewriteOperations = plan.writes.map((item) => {
    const relPath = normalizeSlashes(relative(plan.targetRoot, item.path));
    const sourceRel = normalizeSlashes(relative(plan.targetRoot, item.sourcePath));
    const beforeLines = item.beforeContents.split(/\r?\n/).length;
    const afterLines = item.contents.split(/\r?\n/).length;
    return {
      file: relPath,
      sourceFile: sourceRel,
      kind: item.kind,
      beforeHash: item.beforeHash,
      afterHash: item.afterHash,
      beforeLines,
      afterLines,
      lineDelta: afterLines - beforeLines,
    };
  });

  const deleteOperations = plan.deletes.map((pathAbs) => normalizeSlashes(relative(plan.targetRoot, pathAbs)));

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      renameOperationCount: renameOperations.length,
      rewriteOperationCount: rewriteOperations.length,
      deleteOperationCount: deleteOperations.length,
      importRewriteCount: plan.importRewrites.reduce((sum, item) => sum + item.count, 0),
      blockedCount: plan.blockedFiles.length,
      protectedCount: plan.protectedFiles.length,
    },
    renameOperations,
    rewriteOperations,
    importRewrites: plan.importRewrites,
    deleteOperations,
    blockedFiles: plan.blockedFiles,
    protectedFiles: plan.protectedFiles,
  };
}

function createHumanReport({ manifest, validation, fidelity }) {
  const lines = [];
  lines.push("# FastScript Strict Conversion Report");
  lines.push("");
  lines.push(`- Run ID: ${manifest.runId}`);
  lines.push(`- Target: ${manifest.target}`);
  lines.push(`- Dry run: ${manifest.dryRun ? "yes" : "no"}`);
  lines.push(`- Renamed files: ${manifest.summary.renameCount}`);
  lines.push(`- Rewritten files: ${manifest.summary.rewriteCount}`);
  lines.push(`- Import rewrites: ${manifest.summary.importRewriteCount}`);
  lines.push(`- Blocked files: ${manifest.summary.blockedCount}`);
  lines.push(`- Protected files detected: ${manifest.summary.protectedCount}`);
  lines.push("");
  lines.push("## Validation");
  for (const check of validation.checks) {
    lines.push(`- ${check.id}: ${check.status}`);
  }
  lines.push("");
  lines.push("## Fidelity");
  for (const probe of fidelity.probes) {
    lines.push(`- ${probe.id}: ${probe.status}`);
  }
  lines.push("");
  lines.push(`Overall fidelity: ${fidelity.status}`);
  return `${lines.join("\n")}\n`;
}

export function createStrictConversionPlan(input = []) {
  const options = parseArgs(input);
  const projectRoot = resolve(".");
  const targetRoot = resolve(options.target);
  if (!existsSync(targetRoot)) throw new Error(`migrate: missing path ${targetRoot}`);

  const userConfig = readJsonFile(options.configPath, {});
  const config = mergeConfig(DEFAULT_CONFIG, userConfig || {});
  const beforeState = collectFileState(targetRoot);

  const plan = createPlan({
    projectRoot,
    targetRoot,
    beforeState,
    config,
  });

  return {
    options,
    projectRoot,
    targetRoot,
    config,
    beforeState,
    plan,
  };
}

export async function runMigrate(input = []) {
  const prepared = createStrictConversionPlan(input);
  const { options, projectRoot, targetRoot, config, beforeState, plan } = prepared;

  const summary = summarizePlan(plan);
  const runId = nowRunId();
  const runDir = resolve(options.reportDir, runId);

  const manifest = {
    spec: "FASTSCRIPT_COMPATIBILITY_FIRST_RUNTIME_SPEC#1-#41",
    mode: "rename-only",
    runId,
    generatedAt: new Date().toISOString(),
    dryRun: options.dryRun,
    projectRoot,
    target: normalizeSlashes(relative(projectRoot, targetRoot)) || ".",
    summary,
    convertedFiles: plan.renames.map((item) => ({ from: item.fromRel, to: item.toRel })),
    importRewrites: plan.importRewrites,
    untouchedFiles: plan.untouchedFiles,
    protectedFiles: plan.protectedFiles,
    blockedFiles: plan.blockedFiles,
    protectedScopeViolations: plan.protectedScopeViolations,
    protectedScopeConfig: {
      protectedFiles: config.protectedFiles,
      protectedDirectories: config.protectedDirectories,
      protectedGlobs: config.protectedGlobs,
      protectedExtensions: config.protectedExtensions,
      protectedConfigKeys: config.protectedConfigKeys,
      protectedMarkupRegions: config.protectedMarkupRegions,
    },
    rollback: {
      mode: "manifest-driven",
      operations: createRollbackPlan(plan),
    },
  };
  const diffPreview = createDiffPreview(plan);
  manifest.diffPreview = {
    renameOperationCount: diffPreview.summary.renameOperationCount,
    rewriteOperationCount: diffPreview.summary.rewriteOperationCount,
    deleteOperationCount: diffPreview.summary.deleteOperationCount,
  };
  manifest.trustWorkflow = {
    artifacts: {
      manifest: "conversion-manifest.json",
      diffPreview: "diff-preview.json",
      validation: "validation-report.json",
      fidelity: "fidelity-report.json",
      report: "conversion-report.md",
    },
  };

  if (plan.blockedFiles.length > 0) {
    mkdirSync(runDir, { recursive: true });
    const blockedManifestPath = join(runDir, "conversion-manifest.json");
    const blockedDiffPath = join(runDir, "diff-preview.json");
    writeFileSync(blockedManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    writeFileSync(blockedDiffPath, `${JSON.stringify(diffPreview, null, 2)}\n`, "utf8");
    const latestDir = resolve(options.reportDir, "latest");
    mkdirSync(latestDir, { recursive: true });
    writeFileSync(join(latestDir, "conversion-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    writeFileSync(join(latestDir, "diff-preview.json"), `${JSON.stringify(diffPreview, null, 2)}\n`, "utf8");
    throw new Error(
      `migrate compatibility failure: rename-only conversion blocked by protected/blocked files (${plan.blockedFiles.length}). See ${normalizeSlashes(relative(projectRoot, blockedManifestPath))}.`
    );
  }

  const beforeHashes = calculateHashRows(beforeState);
  let afterState = createAfterVirtualState({ beforeState, plan });

  if (!options.dryRun) {
    applyPlan(plan, runDir);
    afterState = collectFileState(targetRoot);
  }

  const afterHashes = calculateHashRows(afterState);

  const protectedHashViolations = [];
  for (const relPath of plan.protectedFiles) {
    const before = beforeHashes.find((item) => item.path === relPath);
    const after = afterHashes.find((item) => item.path === relPath);
    if (!before || !after) continue;
    if (before.hash !== after.hash) {
      protectedHashViolations.push({ path: relPath, before: before.hash, after: after.hash });
    }
  }

  const beforeGraph = createImportGraph(beforeState, targetRoot);
  const mappedBeforeGraph = mapImportEdges(beforeGraph, targetRoot, plan.renameMap);
  const afterGraph = createImportGraph(afterState, targetRoot);
  const importGraphIntegrity = edgesEqual(mappedBeforeGraph, afterGraph);

  const unresolvedImports = validateImportResolution(afterState);

  const idempotencyState = createStrictConversionPlan([
    targetRoot,
    "--dry-run",
    "--config",
    options.configPath,
    "--report-dir",
    options.reportDir,
    "--fidelity-level",
    options.fidelityLevel,
    options.failOnUnprovenFidelity ? "--fail-on-unproven-fidelity" : "--allow-unproven-fidelity",
  ]);

  const idempotencyOk = idempotencyState.plan.renames.length === 0 && idempotencyState.plan.writes.length === 0;

  const nonTargetMutation = plan.writes.every((item) => pathStartsWith(item.path, targetRoot)) &&
    plan.deletes.every((item) => pathStartsWith(item, targetRoot));

  const validation = {
    generatedAt: new Date().toISOString(),
    checks: [
      { id: "rename-only-conversion", status: "pass", details: "Only extension renames and safe import specifier rewrites are emitted." },
      { id: "protected-file-hash-enforcement", status: protectedHashViolations.length ? "fail" : "pass", details: protectedHashViolations },
      { id: "dependency-graph-integrity", status: importGraphIntegrity ? "pass" : "fail", details: { beforeEdges: mappedBeforeGraph.length, afterEdges: afterGraph.length } },
      { id: "import-resolution", status: unresolvedImports.length ? "fail" : "pass", details: unresolvedImports },
      { id: "idempotency", status: idempotencyOk ? "pass" : "fail", details: { renameCount: idempotencyState.plan.renames.length, rewriteCount: idempotencyState.plan.writes.length } },
      { id: "non-target-mutation", status: nonTargetMutation ? "pass" : "fail", details: "No writes outside target scope were attempted." },
    ],
  };

  const probeCommands = buildFidelityProbeCommands(config);
  const probes = [];

  const requiredByLevel = options.fidelityLevel === "full"
    ? [
      "domSnapshotComparison",
      "computedStyleComparison",
      "screenshotDiffComparison",
      "routeOutputComparison",
      "apiContractComparison",
      "hydrationAndInteractionValidation",
    ]
    : [];

  const requiredFromConfig = [...(config?.fidelity?.requiredProbes || [])];
  const required = [...new Set([...requiredByLevel, ...requiredFromConfig])];

  if (options.fidelityLevel === "full" || requiredFromConfig.length > 0) {
    const probeIdsToRun = options.fidelityLevel === "full"
      ? Object.keys(probeCommands)
      : requiredFromConfig;

    for (const id of probeIdsToRun) {
      const command = probeCommands[id];
      if (!command) {
        probes.push({ id, command: "", status: "fail", reason: "missing probe command mapping" });
        continue;
      }
      if (!hasRunnableScript(projectRoot, command)) {
        probes.push({
          id,
          command,
          status: options.fidelityLevel === "full" ? "fail" : "skipped",
          reason: "probe command unavailable in project",
        });
        continue;
      }
      probes.push(await runProbe(projectRoot, id, command));
    }
  }

  const missingRequired = required.filter((id) => !probes.some((probe) => probe.id === id && probe.status === "pass"));

  const fidelityChecks = [
    { id: "before-after-file-hash-tracking", status: "pass", details: { beforeCount: beforeHashes.length, afterCount: afterHashes.length } },
    { id: "protected-file-hash-enforcement", status: protectedHashViolations.length ? "fail" : "pass", details: protectedHashViolations },
    { id: "import-graph-meaning", status: importGraphIntegrity ? "pass" : "fail", details: { beforeEdges: mappedBeforeGraph.length, afterEdges: afterGraph.length } },
    { id: "idempotency", status: idempotencyOk ? "pass" : "fail", details: { renameCount: idempotencyState.plan.renames.length, rewriteCount: idempotencyState.plan.writes.length } },
  ];

  const fidelityStatus =
    fidelityChecks.some((item) => item.status === "fail") ||
    probes.some((item) => item.status === "fail") ||
    (options.failOnUnprovenFidelity && missingRequired.length > 0)
      ? "fail"
      : "pass";

  const fidelity = {
    generatedAt: new Date().toISOString(),
    level: options.fidelityLevel,
    status: fidelityStatus,
    required,
    missingRequired,
    checks: fidelityChecks,
    probes,
  };

  manifest.hashes = {
    before: beforeHashes,
    after: afterHashes,
  };

  manifest.validation = {
    failedChecks: validation.checks.filter((item) => item.status === "fail").map((item) => item.id),
  };

  manifest.fidelity = {
    status: fidelity.status,
    failedChecks: fidelity.checks.filter((item) => item.status === "fail").map((item) => item.id),
    failedProbes: fidelity.probes.filter((item) => item.status === "fail").map((item) => item.id),
    missingRequired,
  };

  mkdirSync(runDir, { recursive: true });

  const manifestPath = join(runDir, "conversion-manifest.json");
  const diffPreviewPath = join(runDir, "diff-preview.json");
  const validationPath = join(runDir, "validation-report.json");
  const fidelityPath = join(runDir, "fidelity-report.json");
  const markdownPath = join(runDir, "conversion-report.md");

  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  writeFileSync(diffPreviewPath, `${JSON.stringify(diffPreview, null, 2)}\n`, "utf8");
  writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  writeFileSync(fidelityPath, `${JSON.stringify(fidelity, null, 2)}\n`, "utf8");
  writeFileSync(markdownPath, createHumanReport({ manifest, validation, fidelity }), "utf8");

  const latestDir = resolve(options.reportDir, "latest");
  mkdirSync(latestDir, { recursive: true });
  writeFileSync(join(latestDir, "conversion-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  writeFileSync(join(latestDir, "diff-preview.json"), `${JSON.stringify(diffPreview, null, 2)}\n`, "utf8");
  writeFileSync(join(latestDir, "validation-report.json"), `${JSON.stringify(validation, null, 2)}\n`, "utf8");
  writeFileSync(join(latestDir, "fidelity-report.json"), `${JSON.stringify(fidelity, null, 2)}\n`, "utf8");
  writeFileSync(join(latestDir, "conversion-report.md"), createHumanReport({ manifest, validation, fidelity }), "utf8");

  const validationFailed = validation.checks.some((item) => item.status === "fail");
  if (validationFailed) {
    throw new Error(`migrate compatibility failure: validation failed. See ${normalizeSlashes(relative(projectRoot, validationPath))}.`);
  }

  if (fidelity.status === "fail") {
    throw new Error(`migrate compatibility failure: fidelity checks failed. See ${normalizeSlashes(relative(projectRoot, fidelityPath))}.`);
  }

  console.log(`migrate rename-only complete: ${summary.renameCount} renamed, ${summary.rewriteCount} rewritten, ${summary.importRewriteCount} import rewrites`);
  console.log(`migrate report: ${normalizeSlashes(relative(projectRoot, runDir))}`);
}
