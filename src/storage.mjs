import { createHash, createHmac } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";

function sha(input) {
  return createHash("sha1").update(input).digest("hex");
}

function sign(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function createKeyResolver(root) {
  const rootPrefix = root.endsWith(sep) ? root : `${root}${sep}`;
  return function safePathFor(key) {
    const normalized = String(key || "").replace(/\\/g, "/").replace(/^\/+/, "");
    if (!normalized || normalized.includes("\0")) {
      const error = new Error("Invalid storage key");
      error.status = 400;
      throw error;
    }
    const abs = resolve(root, normalized);
    if (abs !== root && !abs.startsWith(rootPrefix)) {
      const error = new Error("Invalid storage key path");
      error.status = 400;
      throw error;
    }
    return { abs, normalized };
  };
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

export function createLocalStorage({ dir = ".fastscript/storage", secret = process.env.STORAGE_SIGNING_SECRET || process.env.SESSION_SECRET || "fastscript-dev-storage-secret" } = {}) {
  const root = resolve(dir);
  mkdirSync(root, { recursive: true });
  const safePathFor = createKeyResolver(root);
  const metaPath = join(root, ".meta.json");
  const state = readJson(metaPath, { files: {} });

  function persistMeta() {
    writeFileSync(metaPath, JSON.stringify(state, null, 2), "utf8");
  }

  function setMeta(key, patch = {}) {
    state.files[key] = {
      acl: "public",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...state.files[key],
      ...patch,
      updatedAt: Date.now(),
    };
    persistMeta();
    return state.files[key];
  }

  function getMeta(key) {
    return state.files[key] || { acl: "public" };
  }

  function parseSignedToken(token) {
    const [dataPart, sig] = String(token || "").split(".");
    if (!dataPart || !sig) return null;
    const expected = sign(dataPart, secret);
    if (expected !== sig) return null;
    const json = Buffer.from(dataPart, "base64url").toString("utf8");
    const payload = JSON.parse(json);
    if (payload.exp < Date.now()) return null;
    return payload;
  }

  return {
    type: "local",
    put(key, content, opts = {}) {
      const { abs, normalized } = safePathFor(key);
      mkdirSync(dirname(abs), { recursive: true });
      writeFileSync(abs, content);
      const meta = setMeta(normalized, { acl: opts.acl || "public" });
      return {
        key: normalized,
        acl: meta.acl,
        etag: sha(Buffer.isBuffer(content) ? content : Buffer.from(String(content))),
      };
    },
    get(key) {
      const { abs, normalized } = safePathFor(key);
      if (!existsSync(abs)) return null;
      return readFileSync(abs);
    },
    meta(key) {
      const { normalized } = safePathFor(key);
      return { ...getMeta(normalized), key: normalized };
    },
    delete(key) {
      const { abs, normalized } = safePathFor(key);
      rmSync(abs, { force: true });
      delete state.files[normalized];
      persistMeta();
    },
    setAcl(key, acl = "private") {
      const { normalized } = safePathFor(key);
      return setMeta(normalized, { acl });
    },
    url(key) {
      const { normalized } = safePathFor(key);
      return `/__storage/${normalized}`;
    },
    signedUrl(key, { action = "get", expiresInSec = 300 } = {}) {
      const { normalized } = safePathFor(key);
      const payload = {
        key: normalized,
        action,
        exp: Date.now() + Math.max(1, expiresInSec) * 1000,
      };
      const dataPart = Buffer.from(JSON.stringify(payload)).toString("base64url");
      const sig = sign(dataPart, secret);
      const token = `${dataPart}.${sig}`;
      return `/__storage/signed?token=${encodeURIComponent(token)}`;
    },
    verifySignedUrl(token) {
      return parseSignedToken(token);
    },
  };
}

export function createS3CompatibleStorage({ bucket, endpoint, region = "auto", presignBaseUrl } = {}) {
  return {
    type: "s3-compatible",
    bucket,
    endpoint,
    region,
    async putWithPresignedUrl(url, content, contentType = "application/octet-stream") {
      const res = await fetch(url, { method: "PUT", headers: { "content-type": contentType }, body: content });
      if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`);
      return true;
    },
    async getWithPresignedUrl(url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`S3 download failed: ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    },
    presignPath(key, action = "get", acl = "private", expiresInSec = 300) {
      if (!presignBaseUrl) throw new Error("presignBaseUrl is required for presignPath");
      return `${presignBaseUrl}?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(key)}&action=${encodeURIComponent(action)}&acl=${encodeURIComponent(acl)}&exp=${encodeURIComponent(String(expiresInSec))}`;
    },
  };
}
