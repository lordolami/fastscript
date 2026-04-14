const BASE_DIRECTIVES = {
  "default-src": ["'self'"],
  "img-src": ["'self'", "data:", "https:"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "font-src": ["'self'", "data:", "https:"],
  "connect-src": ["'self'"],
  "script-src": ["'self'"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
};

export function generateCspPolicy({ target = "node", mode = process.env.NODE_ENV || "development", nonce = "" } = {}) {
  const directives = structuredClone(BASE_DIRECTIVES);
  if (target === "vercel" || target === "cloudflare") {
    directives["connect-src"].push("https://*.vercel.app", "https://*.workers.dev");
  }
  if (mode !== "production") {
    directives["connect-src"].push("ws:", "wss:");
    directives["script-src"].push("'unsafe-eval'");
  }
  if (nonce) directives["script-src"].push(`'nonce-${nonce}'`);

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${[...new Set(values)].join(" ")}`)
    .join("; ");
}
