const s = new Set([1, 2, 3])
const entries = s.entries()
const keys = s.keys()
const values = s.values()
s.forEach((v) => v)

export default function SetIteration() {
  return `${Boolean(entries)}:${Boolean(keys)}:${Boolean(values)}:${s.size}`
}
