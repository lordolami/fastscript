import {loadDocsIndex, rankDocs} from "../../src/docs-search.mjs";
const DOC_INDEX = loadDocsIndex("docs/search-index.json");
export const schemas = {
  GET: {
    q: "string?",
    limit: "int?"
  }
};
export async function GET(ctx) {
  const query = ctx.input.validateQuery(schemas.GET);
  const q = String(query.q || "").trim();
  const limit = Number(query.limit || 10);
  const items = q ? rankDocs(DOC_INDEX, q, {
    limit
  }) : DOC_INDEX.slice(0, limit);
  return ctx.helpers.json({
    ok: true,
    count: items.length,
    items
  });
}
