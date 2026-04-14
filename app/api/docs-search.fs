import {rankDocs} from "../../src/docs-search.mjs";
import {DOC_SEARCH_INDEX} from "../../src/generated/docs-search-index.mjs";
const DOC_INDEX = Array.isArray(DOC_SEARCH_INDEX) ? DOC_SEARCH_INDEX : [];
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
