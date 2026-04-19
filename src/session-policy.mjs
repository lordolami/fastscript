function parseBool(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  if (value === true || value === "true" || value === "1") return true;
  if (value === false || value === "false" || value === "0") return false;
  return fallback;
}

export function resolveSessionPolicy({ env = process.env, mode = env.NODE_ENV || "development" } = {}) {
  const production = mode === "production";
  const secret = String(env.SESSION_SECRET || "");
  const cookieName = String(env.SESSION_COOKIE_NAME || "fs_session");
  const secure = parseBool(env.SESSION_COOKIE_SECURE, production);
  const sameSite = String(env.SESSION_COOKIE_SAMESITE || "Lax");
  const maxAgeSec = Number(env.SESSION_MAX_AGE_SEC || 60 * 60 * 24 * 7);
  const rotateOnRead = parseBool(env.SESSION_ROTATE_ON_READ, false);

  if (production) {
    if (!secret) throw new Error("SESSION_SECRET is required in production.");
    if (secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters in production.");
    if (!secure) throw new Error("SESSION_COOKIE_SECURE must be enabled in production.");
    if (!["Lax", "Strict", "None"].includes(sameSite)) {
      throw new Error("SESSION_COOKIE_SAMESITE must be one of: Lax, Strict, None.");
    }
  }

  return {
    secret: secret || "fastscript-dev-secret",
    cookie: {
      name: cookieName,
      secure,
      sameSite,
      maxAgeSec: Number.isFinite(maxAgeSec) && maxAgeSec > 0 ? maxAgeSec : 60 * 60 * 24 * 7,
      httpOnly: true,
      path: "/",
    },
    rotateOnRead,
  };
}
