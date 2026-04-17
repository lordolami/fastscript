import { runServer } from "./server-runtime.mjs";

export async function runDev() {
  const port = Number(process.env.PORT || 4173);
  await runServer({ mode: "development", watchMode: true, buildOnStart: true, port });
}
