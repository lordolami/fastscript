export const name = "send-receipt";

export async function handle(payload) {
  console.log("send receipt for invoice", payload.invoiceId, "workspace", payload.workspaceId);
}
