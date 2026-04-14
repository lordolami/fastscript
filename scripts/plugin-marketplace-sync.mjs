import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const pluginsFile = resolve("fastscript.plugins.js");
const marketplaceFile = resolve(".agents", "plugins", "marketplace.json");
mkdirSync(resolve(".agents", "plugins"), { recursive: true });

let plugins = [];
if (existsSync(pluginsFile)) {
  const mod = await import(`${pathToFileURL(pluginsFile).href}?t=${Date.now()}`);
  plugins = [...(Array.isArray(mod.plugins) ? mod.plugins : []), ...(Array.isArray(mod.default) ? mod.default : [])];
}

const marketplace = {
  generatedAt: new Date().toISOString(),
  plugins: plugins.map((plugin, index) => ({
    id: plugin.name || `plugin-${index + 1}`,
    name: plugin.name || `Plugin ${index + 1}`,
    apiVersion: plugin.apiVersion || 1,
    description: plugin.description || "",
    status: "active",
  })),
};

if (existsSync(marketplaceFile)) {
  try {
    const previous = JSON.parse(readFileSync(marketplaceFile, "utf8"));
    marketplace.plugins = [...marketplace.plugins, ...((previous.plugins || []).filter((row) => !marketplace.plugins.find((x) => x.id === row.id)))];
  } catch {}
}

writeFileSync(marketplaceFile, JSON.stringify(marketplace, null, 2), "utf8");
console.log(`plugin marketplace metadata synced: ${marketplaceFile}`);
