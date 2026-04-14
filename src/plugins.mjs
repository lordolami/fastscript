import { existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { importSourceModule } from "./module-loader.mjs";

export const PLUGIN_API_VERSION = 1;
const DEFAULT_PLUGIN_TIMEOUT_MS = Number(process.env.PLUGIN_TIMEOUT_MS || 2500);

const CONFIG_CANDIDATES = [
  "fastscript.plugins.fs",
  "fastscript.plugins.js",
  "fastscript.plugins.mjs",
  "fastscript.plugins.cjs",
  "app/plugins.fs",
  "app/plugins.js",
  "app/plugins.mjs",
  "app/plugins.cjs",
];

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function createNullLogger() {
  return {
    info() {},
    warn() {},
    error() {},
  };
}

function withTimeout(task, ms, label) {
  if (!Number.isFinite(ms) || ms <= 0) return task;
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const error = new Error(`Plugin hook timeout (${ms}ms): ${label}`);
      error.code = "PLUGIN_HOOK_TIMEOUT";
      reject(error);
    }, ms);
  });
  return Promise.race([task.finally(() => clearTimeout(timer)), timeout]);
}

async function importPluginModule(file) {
  const abs = resolve(file);
  const ext = extname(abs).toLowerCase();
  if (ext === ".fs") return importSourceModule(abs, { platform: "node" });
  return import(`${pathToFileURL(abs).href}?t=${Date.now()}`);
}

function normalizePluginEntries(mod) {
  const entries = [];
  entries.push(...asArray(mod?.plugins));
  entries.push(...asArray(mod?.default));
  return entries;
}

function normalizePlugin(raw, fallbackName) {
  if (!raw) return null;
  if (typeof raw === "function") {
    return { name: fallbackName, apiVersion: PLUGIN_API_VERSION, setup: raw };
  }
  if (typeof raw !== "object") return null;
  const setup = typeof raw.setup === "function" ? raw.setup : null;
  const plugin = {
    name: raw.name || fallbackName,
    apiVersion: Number.isInteger(raw.apiVersion) ? raw.apiVersion : PLUGIN_API_VERSION,
    setup,
  };
  if (typeof raw.middleware === "function") plugin.middleware = raw.middleware;
  if (typeof raw.onBuildStart === "function") plugin.onBuildStart = raw.onBuildStart;
  if (typeof raw.onBuildEnd === "function") plugin.onBuildEnd = raw.onBuildEnd;
  if (typeof raw.onRequestStart === "function") plugin.onRequestStart = raw.onRequestStart;
  if (typeof raw.onRequestEnd === "function") plugin.onRequestEnd = raw.onRequestEnd;
  return plugin;
}

function createRegistry() {
  return {
    middleware: [],
    onBuildStart: [],
    onBuildEnd: [],
    onRequestStart: [],
    onRequestEnd: [],
  };
}

async function runHookList(hooks, ctx, logger, stage) {
  for (const hook of hooks) {
    const label = `${hook.plugin}:${stage}`;
    try {
      await withTimeout(Promise.resolve(hook.fn(ctx)), hook.timeoutMs ?? DEFAULT_PLUGIN_TIMEOUT_MS, label);
    } catch (error) {
      logger.warn("plugin_hook_failed", {
        plugin: hook.plugin,
        stage,
        error: error?.message || String(error),
      });
    }
  }
}

function createHookApi(registry, pluginName) {
  return {
    middleware(fn, opts = {}) {
      if (typeof fn !== "function") return;
      registry.middleware.push({ plugin: pluginName, fn, timeoutMs: opts.timeoutMs });
    },
    onBuildStart(fn, opts = {}) {
      if (typeof fn !== "function") return;
      registry.onBuildStart.push({ plugin: pluginName, fn, timeoutMs: opts.timeoutMs });
    },
    onBuildEnd(fn, opts = {}) {
      if (typeof fn !== "function") return;
      registry.onBuildEnd.push({ plugin: pluginName, fn, timeoutMs: opts.timeoutMs });
    },
    onRequestStart(fn, opts = {}) {
      if (typeof fn !== "function") return;
      registry.onRequestStart.push({ plugin: pluginName, fn, timeoutMs: opts.timeoutMs });
    },
    onRequestEnd(fn, opts = {}) {
      if (typeof fn !== "function") return;
      registry.onRequestEnd.push({ plugin: pluginName, fn, timeoutMs: opts.timeoutMs });
    },
  };
}

function configFiles(root) {
  return CONFIG_CANDIDATES.map((file) => join(root, file)).filter((p) => existsSync(p));
}

export async function createPluginRuntime({ root = process.cwd(), logger = createNullLogger() } = {}) {
  const files = configFiles(root);
  const registry = createRegistry();
  const loaded = [];

  for (const file of files) {
    let mod;
    try {
      mod = await importPluginModule(file);
    } catch (error) {
      logger.warn("plugin_module_load_failed", { file, error: error?.message || String(error) });
      continue;
    }
    const rawEntries = normalizePluginEntries(mod);
    rawEntries.forEach((raw, idx) => {
      const plugin = normalizePlugin(raw, `${file}#${idx + 1}`);
      if (!plugin) return;
      if (plugin.apiVersion !== PLUGIN_API_VERSION) {
        logger.warn("plugin_api_version_mismatch", {
          plugin: plugin.name,
          expected: PLUGIN_API_VERSION,
          received: plugin.apiVersion,
        });
        return;
      }

      const hooks = createHookApi(registry, plugin.name);
      try {
        if (plugin.middleware) hooks.middleware(plugin.middleware);
        if (plugin.onBuildStart) hooks.onBuildStart(plugin.onBuildStart);
        if (plugin.onBuildEnd) hooks.onBuildEnd(plugin.onBuildEnd);
        if (plugin.onRequestStart) hooks.onRequestStart(plugin.onRequestStart);
        if (plugin.onRequestEnd) hooks.onRequestEnd(plugin.onRequestEnd);
        if (plugin.setup) plugin.setup({ hooks, apiVersion: PLUGIN_API_VERSION });
        loaded.push({ name: plugin.name, file });
      } catch (error) {
        logger.warn("plugin_setup_failed", { plugin: plugin.name, file, error: error?.message || String(error) });
      }
    });
  }

  return {
    apiVersion: PLUGIN_API_VERSION,
    loaded,
    middleware() {
      return registry.middleware.map((row) => row.fn);
    },
    async onBuildStart(ctx = {}) {
      await runHookList(registry.onBuildStart, ctx, logger, "onBuildStart");
    },
    async onBuildEnd(ctx = {}) {
      await runHookList(registry.onBuildEnd, ctx, logger, "onBuildEnd");
    },
    async onRequestStart(ctx = {}) {
      await runHookList(registry.onRequestStart, ctx, logger, "onRequestStart");
    },
    async onRequestEnd(ctx = {}) {
      await runHookList(registry.onRequestEnd, ctx, logger, "onRequestEnd");
    },
  };
}
