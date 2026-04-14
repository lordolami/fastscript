import { replayDeadLetter, runWorker } from "./jobs.mjs";

export async function runWorkerCommand(args = []) {
  if (args[0] === "replay-dead-letter") {
    const limitArg = args.indexOf("--limit");
    const nameArg = args.indexOf("--name");
    const limit = limitArg >= 0 ? Number(args[limitArg + 1] || 20) : 20;
    const name = nameArg >= 0 ? args[nameArg + 1] || null : null;
    const replayed = await replayDeadLetter({
      dir: ".fastscript",
      limit,
      name,
      driver: process.env.JOBS_DRIVER || "file",
    });
    console.log(`dead-letter replayed: ${replayed.length}`);
    return;
  }

  await runWorker({
    dir: ".fastscript",
    pollMs: Number(process.env.WORKER_POLL_MS || 350),
    driver: process.env.JOBS_DRIVER || "file",
  });
}
