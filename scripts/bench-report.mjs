import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { performance } from "node:perf_hooks";
import { runBuild } from "../src/build.mjs";

function gzipSize(path) {
  if (!existsSync(path)) return 0;
  return gzipSync(readFileSync(path), { level: 9 }).byteLength;
}

function kb(n) {
  return (n / 1024).toFixed(2);
}

const t0 = performance.now();
await runBuild();
const t1 = performance.now();

const dist = resolve('dist');
const manifest = JSON.parse(readFileSync(join(dist, 'fastscript-manifest.json'), 'utf8'));
const assetManifestPath = join(dist, 'asset-manifest.json');
const assetManifest = existsSync(assetManifestPath) ? JSON.parse(readFileSync(assetManifestPath, 'utf8')) : { mapping: {} };
function resolveAsset(logicalName) {
  const direct = join(dist, logicalName);
  if (existsSync(direct)) return direct;
  const mapped = assetManifest?.mapping?.[logicalName];
  return join(dist, (mapped || logicalName).replace(/^\.\//, ''));
}
const jsAssets = [resolveAsset('router.js')];
if (manifest.layout) jsAssets.push(resolveAsset(manifest.layout.replace(/^\.\//, '')));
const home = manifest.routes.find((r) => r.path === '/');
if (home?.module) jsAssets.push(resolveAsset(home.module.replace(/^\.\//, '')));
const cssAssets = [resolveAsset('styles.css')];

const js = jsAssets.reduce((s, p) => s + gzipSize(p), 0);
const css = cssAssets.reduce((s, p) => s + gzipSize(p), 0);

const agencyRuntimePath = resolve('benchmarks', 'agency-ops-runtime.json');
const agencyRuntime = existsSync(agencyRuntimePath) ? JSON.parse(readFileSync(agencyRuntimePath, 'utf8')) : null;
const runtimeSection = agencyRuntime ? `\n## Agency Ops Runtime Snapshot\n- Home /: ${agencyRuntime.timingsMs.home}ms\n- Sign-in /sign-in: ${agencyRuntime.timingsMs.signIn}ms\n- Session bootstrap /api/session: ${agencyRuntime.timingsMs.sessionBootstrap}ms\n- Dashboard /dashboard: ${agencyRuntime.timingsMs.dashboard}ms\n- Clients /dashboard/clients: ${agencyRuntime.timingsMs.clientsPage}ms\n- Clients mutation /api/clients: ${agencyRuntime.timingsMs.clientsApiMutation}ms\n` : '';

const md = `# FastScript Benchmark Report\n\n- Build time: ${(t1 - t0).toFixed(2)}ms\n- Routes: ${manifest.routes.length}\n- API routes: ${manifest.apiRoutes?.length ?? 0}\n- JS first-load gzip: ${kb(js)}KB\n- CSS first-load gzip: ${kb(css)}KB\n\n## Budgets\n- JS budget (30KB): ${js <= 30 * 1024 ? 'PASS' : 'FAIL'}\n- CSS budget (10KB): ${css <= 10 * 1024 ? 'PASS' : 'FAIL'}${runtimeSection}\n`;

const outDir = resolve('benchmarks');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'latest-report.md'), md, 'utf8');
console.log('bench report written: benchmarks/latest-report.md');
