const row = { a: 1 }
Object.freeze(row)
Object.seal(row)
Object.preventExtensions(row)
const a = Object.isFrozen(row)
const b = Object.isSealed(row)
const c = Object.isExtensible(row)

export default function ObjectFreezeSeal() {
  return `${a}:${b}:${c}`
}
