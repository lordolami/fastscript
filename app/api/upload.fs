export const schemas = {
  POST: {
    key: "string",
    content: "string",
    acl: "string?"
  }
};
export async function POST(ctx) {
  const body = await ctx.input.validateBody(schemas.POST);
  const put = ctx.storage.put(body.key, Buffer.from(body.content, "utf8"), {
    acl: body.acl || "public"
  });
  const signedUrl = ctx.storage.signedUrl ? ctx.storage.signedUrl(body.key, {
    action: "get",
    expiresInSec: 900
  }) : null;
  return ctx.helpers.json({
    ok: true,
    ...put,
    url: ctx.storage.url(body.key),
    signedUrl
  });
}
