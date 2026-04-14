const g = globalThis
const r = new Request("https://example.com")
const h = new Headers()
h.set("x-test", "1")
const f = new FormData()
f.append("k", "v")
const c = new AbortController()
const sig = c.signal
const tm = setTimeout(() => "ok", 1)
clearTimeout(tm)

export default function RuntimeContextsFixture() {
  return `${Boolean(g)}:${Boolean(r)}:${h.get("x-test")}:${f.get("k")}:${Boolean(sig)}`
}
