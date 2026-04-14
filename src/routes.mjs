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

function routeSegmentValue(segment) {
  if (!segment) return null;
  if (isGroupSegment(segment)) return null;
  if (isParallelSegment(segment)) return null;
  if (segment === "index") return null;
  if (segment.startsWith("[") && segment.endsWith("]")) return `:${segment.slice(1, -1)}`;
  return segment;
}

export function inferRouteMeta(file, pagesDir) {
  const parts = cleanSegments(file, pagesDir);
  const pageFile = parts[parts.length - 1] || "index";
  const parallel = parts.find((segment) => isParallelSegment(segment));
  const slot = parallel ? parallel.slice(1) : null;
  const routeParts = [];
  const params = [];

  for (const part of parts) {
    const mapped = routeSegmentValue(part);
    if (!mapped) continue;
    routeParts.push(mapped);
    if (mapped.startsWith(":")) params.push(mapped.slice(1));
  }

  const routePath = routeParts.length ? `/${routeParts.join("/")}` : "/";
  const normalizedParts = parts.filter((segment) => !isGroupSegment(segment) && !isParallelSegment(segment));

  return {
    file,
    pageFile,
    routePath,
    params,
    slot,
    segments: normalizedParts,
    directory: dirname(relative(pagesDir, file).replace(/\\/g, "/")),
  };
}

export function inferRouteParamTypes(routePath) {
  const params = {};
  for (const segment of String(routePath || "").split("/")) {
    if (segment.startsWith(":")) params[segment.slice(1)] = "string";
  }
  return params;
}

export function inferRouteLayouts(file, pagesDir, layoutFiles = new Set()) {
  const relDir = dirname(relative(pagesDir, file).replace(/\\/g, "/"));
  const chain = [];
  const dirs = relDir === "." ? [""] : relDir.split("/").filter(Boolean);
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
