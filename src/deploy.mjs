import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

function parseArgs(args = []) {
  let target = "node";
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--target") target = (args[i + 1] || "node").toLowerCase();
  }
  return { target };
}

function writeNodeAdapter(root) {
  writeFileSync(
    join(root, "ecosystem.config.cjs"),
    `module.exports = {\n  apps: [{\n    name: "fastscript-app",\n    script: "node",\n    args: "./src/cli.mjs start",\n    instances: "max",\n    exec_mode: "cluster",\n    env: {\n      NODE_ENV: "production",\n      PORT: 4173\n    }\n  }]\n};\n`,
    "utf8",
  );
  writeFileSync(
    join(root, "Dockerfile"),
    `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\nRUN npm run build\nENV NODE_ENV=production\nENV PORT=4173\nEXPOSE 4173\nHEALTHCHECK --interval=30s --timeout=5s CMD wget -q -O /dev/null http://127.0.0.1:4173/__metrics || exit 1\nCMD ["node","./src/cli.mjs","start"]\n`,
    "utf8",
  );
}

function writeVercelAdapter(root) {
  mkdirSync(join(root, "api"), { recursive: true });
  writeFileSync(
    join(root, "api", "index.mjs"),
    `import handler from "../src/serverless-handler.mjs";\nexport default handler;\n`,
    "utf8",
  );
  writeFileSync(
    join(root, "vercel.json"),
    JSON.stringify(
      {
        version: 2,
        functions: {
          "api/index.mjs": {
            runtime: "nodejs20.x",
            maxDuration: 30,
          },
        },
        routes: [
          { src: "/(.*\\.(js|css|json|map|webmanifest|png|jpg|jpeg|svg|gif|woff|woff2|ttf|otf))", dest: "/dist/$1" },
          { src: "/(.*)", dest: "/api/index.mjs" },
        ],
      },
      null,
      2,
    ),
    "utf8",
  );
}

function writeCloudflareAdapter(root) {
  mkdirSync(join(root, "dist"), { recursive: true });
  writeFileSync(
    join(root, "dist", "worker.js"),
    `export default {\n  async fetch(request, env) {\n    const url = new URL(request.url);\n    if (url.pathname.startsWith("/api/")) {\n      return new Response(JSON.stringify({ ok: false, error: "Cloudflare adapter expects API logic in Worker bindings or edge handlers." }), { status: 501, headers: { "content-type": "application/json" } });\n    }\n    return env.ASSETS.fetch(request);\n  }\n};\n`,
    "utf8",
  );
  writeFileSync(
    join(root, "wrangler.toml"),
    `name = "fastscript-app"\nmain = "dist/worker.js"\ncompatibility_date = "2026-04-14"\nworkers_dev = true\n[assets]\ndirectory = "dist"\nbinding = "ASSETS"\n`,
    "utf8",
  );
}

export async function runDeploy(args = []) {
  const { target } = parseArgs(args);
  const root = resolve(process.cwd());

  if (target === "node" || target === "pm2") {
    writeNodeAdapter(root);
    console.log("deploy adapter ready: node/pm2 + docker");
    return;
  }

  if (target === "vercel") {
    writeVercelAdapter(root);
    console.log("deploy adapter ready: vercel");
    return;
  }

  if (target === "cloudflare") {
    writeCloudflareAdapter(root);
    console.log("deploy adapter ready: cloudflare");
    return;
  }

  throw new Error(`Unknown deploy target: ${target}. Use node|pm2|vercel|cloudflare`);
}
