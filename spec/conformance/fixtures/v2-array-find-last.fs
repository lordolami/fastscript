const xs = [1, 2, 3, 4, 5]
const a = xs.find((n) => n > 2)
const b = xs.findLast((n) => n > 2)
const c = xs.findIndex((n) => n > 2)
const d = xs.findLastIndex((n) => n > 2)

export default function ArrayFindLast() {
  return `${a}:${b}:${c}:${d}`
}
