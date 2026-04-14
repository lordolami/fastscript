const s = "fastscript fastscript"
const r1 = s.replace("fast", "FAST")
const r2 = s.replaceAll("script", "SCRIPT")
const i = s.search("script")
const m = s.match("fast")

export default function StringSearchReplace() {
  return `${r1}:${r2}:${i}:${Boolean(m)}`
}
