const p = new URLSearchParams("a=1&b=2")
const e = p.entries()
const k = p.keys()
const v = p.values()
p.sort()

export default function UrlSearchParamsIter() {
  return `${Boolean(e)}:${Boolean(k)}:${Boolean(v)}:${p.toString()}`
}
