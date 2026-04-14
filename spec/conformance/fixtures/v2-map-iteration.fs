const m = new Map([["a", 1], ["b", 2]])
const e = m.entries()
const k = m.keys()
const v = m.values()
m.forEach((val) => val)

export default function MapIteration() {
  return `${Boolean(e)}:${Boolean(k)}:${Boolean(v)}:${m.size}`
}
