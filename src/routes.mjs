import { dirname, extname, relative } from "node:path";

function cleanSegments(file, pagesDir) {
  const rel = relative(pagesDir, file).replace(/\\/g, "/").replace(extname(file), "");
  return rel.split("/").filter(Boolean);
}

function isGroupSegment(segment) {
  return segment.startsWith("(") && segment.endsWith(")");
}

function isParallelSegment(segment) {
  return segment.startsWith("@");
}

function normalizeParamType(type) {
  const raw = String(type || "string").toLowerCase();
  if (raw === "int" || raw === "float" || raw === "number") return "number";
  if (raw === "bool" || raw === "boolean") return "boolean";
  if (raw === "str" || raw === "string") return "string";
  return "string";
}

function routeSegmentValue(segment) {
  if (!segment) return null;
  if (isGroupSegment(segment)) return null;
  if (isParallelSegment(segment)) return null;
  if (segment === "index") return null;
  const optionalCatchAll = /^\[\[\.\.\.([A-Za-z_$][\w$]*)\]\]$/.exec(segment);
  if (optionalCatchAll) {
    return {
      value: `:${optionalCatchAll[1]}*?`,
      param: { name: optionalCatchAll[1], type: "string[] | undefined", optional: true, catchAll: true },
    };
  }
  const requiredCatchAll = /^\[\.\.\.([A-Za-z_$][\w$]*)\]$/.exec(segment);
  if (requiredCatchAll) {
    return {
      value: `:${requiredCatchAll[1]}*`,
      param: { name: requiredCatchAll[1], type: "string[]", optional: false, catchAll: true },
    };
  }
  const optionalTyped = /^\[\[([A-Za-z_$][\w$]*)(?::([A-Za-z]+))?\]\]$/.exec(segment);
  if (optionalTyped) {
    const type = normalizeParamType(optionalTyped[2]);
    return {
      value: `:${optionalTyped[1]}?`,
      param: { name: optionalTyped[1], type: `${type} | undefined`, optional: true, catchAll: false },
    };
  }
  const simpleTyped = /^\[([A-Za-z_$][\w$]*)(?::([A-Za-z]+))?\]$/.exec(segment);
  if (simpleTyped) {
    const type = normalizeParamType(simpleTyped[2]);
    return {
      value: `:${simpleTyped[1]}`,
      param: { name: simpleTyped[1], type, optional: false, catchAll: false },
    };
  }
  return { value: segment, param: null };
}

export function inferRouteMeta(file, pagesDir) {
  const parts = cleanSegments(file, pagesDir);
  const pageFile = parts[parts.length - 1] || "index";
  const parallel = parts.find((segment) => isParallelSegment(segment));
  const slot = parallel ? parallel.slice(1) : null;
  const routeParts = [];
  const params = [];
  const paramTypes = {};

  for (const part of parts) {
    const mapped = routeSegmentValue(part);
    if (!mapped?.value) continue;
    routeParts.push(mapped.value);
    if (mapped.param) {
      params.push(mapped.param.name);
      paramTypes[mapped.param.name] = mapped.param.type;
    }
  }

  const routePath = routeParts.length ? `/${routeParts.join("/")}` : "/";
  const normalizedParts = parts.filter((segment) => !isGroupSegment(segment) && !isParallelSegment(segment));

  return {
    file,
    pageFile,
    routePath,
    params,
    paramTypes,
    slot,
    segments: normalizedParts,
    directory: dirname(relative(pagesDir, file).replace(/\\/g, "/")),
  };
}

export function inferRouteParamTypes(routePath, paramTypes = null) {
  if (paramTypes && typeof paramTypes === "object" && Object.keys(paramTypes).length) {
    return { ...paramTypes };
  }
  const params = {};
  for (const segment of String(routePath || "").split("/")) {
    const token = /^:([A-Za-z_$][\w$]*)(\*)?(\?)?$/.exec(segment);
    if (!token) continue;
    const name = token[1];
    const catchAll = Boolean(token[2]);
    const optional = Boolean(token[3]);
    if (catchAll && optional) params[name] = "string[] | undefined";
    else if (catchAll) params[name] = "string[]";
    else if (optional) params[name] = "string | undefined";
    else params[name] = "string";
  }
  return params;
}

export function inferRouteLayouts(file, pagesDir, layoutFiles = new Set()) {
  const relDir = dirname(relative(pagesDir, file).replace(/\\/g, "/"));
  const chain = [];
  const dirs = relDir === "." ? [] : relDir.split("/").filter(Boolean);
  const probes = [""];
  for (const dir of dirs) {
    probes.push(probes[probes.length - 1] ? `${probes[probes.length - 1]}/${dir}` : dir);
  }

  for (const probe of probes) {
    const fsLayout = probe ? `${probe}/_layout.fs` : "_layout.fs";
    const jsLayout = probe ? `${probe}/_layout.js` : "_layout.js";
    if (layoutFiles.has(fsLayout)) chain.push(fsLayout);
    else if (layoutFiles.has(jsLayout)) chain.push(jsLayout);
  }
  return chain;
}

export function isLayoutFile(file, pagesDir) {
  const rel = relative(pagesDir, file).replace(/\\/g, "/");
  return rel.endsWith("/_layout.fs") || rel.endsWith("/_layout.js") || rel === "_layout.fs" || rel === "_layout.js";
}

export function isNotFoundFile(file, pagesDir) {
  const rel = relative(pagesDir, file).replace(/\\/g, "/");
  return rel.endsWith("/404.fs") || rel.endsWith("/404.js") || rel === "404.fs" || rel === "404.js";
}
