export const name = "send-notification";

export async function handle(payload) {
  console.log("send notification", payload.kind, "agency", payload.agencyId, "job", payload.jobId || "direct");
}
