import assert from "node:assert/strict";
import { resolve } from "node:path";
import { inferRouteMeta, inferRouteParamTypes, sortRoutesByPriority } from "../src/routes.mjs";

const pagesDir = resolve("app/pages");

const typed = inferRouteMeta(resolve("app/pages/blog/[id:int].fs"), pagesDir);
assert.equal(typed.routePath, "/blog/:id");
assert.deepEqual(typed.paramTypes, { id: "number" });

const catchAll = inferRouteMeta(resolve("app/pages/docs/[...slug].fs"), pagesDir);
assert.equal(catchAll.routePath, "/docs/:slug*");
assert.deepEqual(catchAll.paramTypes, { slug: "string[]" });

const optionalCatchAll = inferRouteMeta(resolve("app/pages/docs/[[...rest]].fs"), pagesDir);
assert.equal(optionalCatchAll.routePath, "/docs/:rest*?");
assert.deepEqual(optionalCatchAll.paramTypes, { rest: "string[] | undefined" });

const optionalSingle = inferRouteMeta(resolve("app/pages/[[locale]].fs"), pagesDir);
assert.equal(optionalSingle.routePath, "/:locale?");
assert.deepEqual(optionalSingle.paramTypes, { locale: "string | undefined" });

assert.deepEqual(inferRouteParamTypes("/:id/:slug*"), { id: "string", slug: "string[]" });
assert.deepEqual(inferRouteParamTypes("/:id/:slug*?"), { id: "string", slug: "string[] | undefined" });
assert.deepEqual(inferRouteParamTypes("/:locale?"), { locale: "string | undefined" });

const sorted = sortRoutesByPriority([
  { path: "/docs/:slug*" },
  { path: "/docs/reference" },
  { path: "/docs/:id" },
  { path: "/docs/:locale?" },
]);
assert.deepEqual(sorted.map((item) => item.path), [
  "/docs/reference",
  "/docs/:id",
  "/docs/:locale?",
  "/docs/:slug*",
]);

console.log("test-routes pass");
