export const name = "send-notification";

export async function handle(payload) {
  console.log("send notification", payload.kind, "workspace", payload.workspaceId, "job", payload.jobId || "direct");
}
