export const schema = {
  SESSION_SECRET: "string?",
  DATABASE_URL: "string?",
  REDIS_URL: "string?",
  WEBHOOK_SECRET: "string?",
  NODE_ENV: "string?",
  PORT: "int?",
  CACHE_DRIVER: "string?",
  STORAGE_DRIVER: "string?",
  STORAGE_S3_BUCKET: "string?",
  STORAGE_S3_ENDPOINT: "string?",
  STORAGE_S3_REGION: "string?",
  STORAGE_S3_PRESIGN_BASE_URL: "string?",
  METRICS_PUBLIC: "string?",
  MAX_BODY_BYTES: "int?",
  REQUEST_TIMEOUT_MS: "int?",
  FASTSCRIPT_DEPLOY_TARGET: "string?"
};
