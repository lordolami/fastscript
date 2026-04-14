const base = { z: 1 }
const made = Object.create(base)
Object.defineProperty(made, "a", { value: 1, enumerable: true })
Object.defineProperties(made, { b: { value: 2, enumerable: true } })

export default function ObjectCreateDefine() {
  return `${made.a}:${made.b}:${Boolean(made)}`
}
