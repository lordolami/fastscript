const row = { a: 1, b: 2 }
const keys = Object.keys(row)
const values = Object.values(row)
const entries = Object.entries(row)
const merged = Object.assign({}, row, { c: 3 })
const fromEntries = Object.fromEntries(entries)
const hasA = Object.hasOwn(row, "a")

export default function ObjectMethods() {
  return `${keys.length}:${values.length}:${entries.length}:${merged.c}:${fromEntries.a}:${hasA}`
}
