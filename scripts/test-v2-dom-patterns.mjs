import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runTypeCheck } from "../src/typecheck.mjs";

const root = resolve(".tmp-v2-dom-patterns");
rmSync(root, { recursive: true, force: true });
mkdirSync(join(root, "pages"), { recursive: true });

writeFileSync(
  join(root, "pages", "index.fs"),
  `const app = document.querySelector("#app")
const list = document.querySelectorAll(".item")
const byId = document.getElementById("root")
const form = document.querySelector("form")
const data = new FormData(form)
const href = location.href
const path = location.pathname
const w = window.innerWidth
const h = window.innerHeight

window.addEventListener("click", (event) => {
  const target = event?.target
  if (app?.classList?.contains("ready")) {
    app.classList.toggle("ready")
  }
  if (target?.closest) {
    const button = target.closest("button")
    if (button) {
      button.setAttribute("data-clicked", "1")
    }
  }
})

history.pushState({}, "", "/x")
localStorage.setItem("a", "1")
const v = localStorage.getItem("a")
sessionStorage.setItem("b", "2")
const b = sessionStorage.getItem("b")
window.scrollTo(0, 10)

export default function DomPatterns() {
  return String(Boolean(app)) + ":" + String(list.length) + ":" + String(Boolean(byId)) + ":" + String(data.get("x")) + ":" + href + ":" + path + ":" + String(w + h) + ":" + String(v) + ":" + String(b)
}`,
  "utf8",
);

await runTypeCheck(["--path", root, "--mode", "pass"]);
const report = JSON.parse(readFileSync(resolve(".fastscript", "typecheck-report.json"), "utf8"));
const errors = (report.diagnostics || []).filter((d) => d.severity === "error");
assert.equal(errors.length, 0, `Expected zero type errors, got ${errors.length}`);

rmSync(root, { recursive: true, force: true });
console.log("test-v2-dom-patterns pass");
