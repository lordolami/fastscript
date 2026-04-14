import { compileFastScript } from "./fs-parser.mjs";

export function normalizeFastScript(source, options = {}) {
  const { code } = compileFastScript(source, {
    file: options.file || "",
    mode: options.mode || "lenient",
    recover: options.recover !== false,
    inlineSourceMap: options.sourceMap === "inline",
  });
  return code;
}

export function normalizeFastScriptWithMetadata(source, options = {}) {
  return compileFastScript(source, {
    file: options.file || "",
    mode: options.mode || "lenient",
    recover: options.recover !== false,
    inlineSourceMap: options.sourceMap === "inline",
  });
}

export function stripTypeScriptHints(source) {
  const lines = source.split(/\r?\n/);
  const out = [];
  let skippingBlock = false;
  let blockDepth = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    let next = line;

    if (skippingBlock) {
      const opens = (next.match(/{/g) || []).length;
      const closes = (next.match(/}/g) || []).length;
      blockDepth += opens - closes;
      if (blockDepth <= 0) {
        skippingBlock = false;
        blockDepth = 0;
      }
      continue;
    }

    if (/^\s*interface\s+[A-Za-z_$][\w$]*\s*[{]/.test(next) || /^\s*enum\s+[A-Za-z_$][\w$]*\s*[{]/.test(next)) {
      out.push(`// ${next.trim()} (removed by fastscript migrate)`);
      skippingBlock = true;
      const opens = (next.match(/{/g) || []).length;
      const closes = (next.match(/}/g) || []).length;
      blockDepth = Math.max(1, opens - closes);
      continue;
    }

    if (/^\s*type\s+[A-Za-z_$][\w$]*\s*=/.test(next)) {
      out.push(`// ${next.trim()} (removed by fastscript migrate)`);
      if (!next.includes(";") && next.includes("{")) {
        skippingBlock = true;
        const opens = (next.match(/{/g) || []).length;
        const closes = (next.match(/}/g) || []).length;
        blockDepth = Math.max(1, opens - closes);
      }
      continue;
    }

    next = next.replace(/\bimport\s+type\b/g, "import");
    next = next.replace(/\bexport\s+type\b/g, "export");

    next = next.replace(
      /^(\s*)(const|let|var)\s+([A-Za-z_$][\w$]*)\s*:\s*([^=;]+)([=;].*)$/,
      "$1$2 $3 $5",
    );

    if (/\bfunction\b/.test(next) || /\)\s*=>/.test(next)) {
      next = next.replace(/\(([^)]*)\)/, (_, params) => {
        const cleaned = params.replace(
          /([A-Za-z_$][\w$]*)\s*:\s*([A-Za-z_$][\w$<>\[\]\|&, ?.]*)/g,
          "$1",
        );
        return `(${cleaned})`;
      });
      next = next.replace(/\)\s*:\s*([A-Za-z_$][\w$<>\[\]\|&, ?.]*)\s*\{/g, ") {");
      next = next.replace(/\bfunction\s+([A-Za-z_$][\w$]*)\s*<[^>]+>\s*\(/g, "function $1(");
    }

    next = next.replace(/^\s*<([A-Za-z_$][\w$,\s]*)>\s*\(/, "(");
    next = next.replace(/\)\s*=>\s*<[A-Za-z_$][\w$<>\[\]\|&, ?.]*>/g, ") =>");
    next = next.replace(/\sas\s+const\b/g, "");
    next = next.replace(/\s+satisfies\s+[A-Za-z_$][\w$<>\[\]\|&, ?.]*/g, "");
    out.push(next);
  }

  return out.join("\n");
}
