import { runServer } from "./server-runtime.mjs";

let serverPromise = null;

async function getServer() {
  if (!serverPromise) {
    serverPromise = runServer({
      mode: process.env.NODE_ENV || "production",
      watchMode: false,
      buildOnStart: false,
      listen: false,
    });
  }
  return serverPromise;
}

export default async function handler(req, res) {
  const server = await getServer();
  server.emit("request", req, res);
}
