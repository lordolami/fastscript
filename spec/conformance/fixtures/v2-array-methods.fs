const base = [1, 2, 3]
const copy = base.slice(0)
copy.push(4)
const trimmed = copy.filter((n) => n > 1)
const mapped = trimmed.map((n) => n * 2)
const reduced = mapped.reduce((acc, n) => acc + n, 0)
const found = mapped.find((n) => n > 2)
const idx = mapped.findIndex((n) => n > 2)
const flat = [[1], [2]].flat()
const flatMapped = [1, 2].flatMap((n) => [n, n + 10])

export default function ArrayMethods() {
  return `${reduced}:${found}:${idx}:${flat.length}:${flatMapped.length}`
}
