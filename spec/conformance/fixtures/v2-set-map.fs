const set = new Set([1, 2, 3])
set.add(4)
const hasTwo = set.has(2)
const map = new Map([["a", 1]])
map.set("b", 2)
const val = map.get("a")

export default function SetMap() {
  return `${hasTwo}:${val}:${set.size}:${map.size}`
}
