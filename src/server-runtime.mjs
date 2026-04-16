import { Client } from "pg";
import { runServer as coreRunServer } from "@fastscript/core-private/server-runtime";

async function verifyPostgresRuntime() {
  if ((process.env.DB_DRIVER || "").toLowerCase() !== "postgres") return;
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required when DB_DRIVER=postgres");
  }
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.end();
}

export async function runServer(options = {}) {
  await verifyPostgresRuntime();
  return coreRunServer(options);
}
