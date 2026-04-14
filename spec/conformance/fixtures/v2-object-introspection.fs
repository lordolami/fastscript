const row = { a: 1, b: 2 }
const proto = Object.getPrototypeOf(row)
Object.setPrototypeOf(row, proto)
const desc = Object.getOwnPropertyDescriptor(row, "a")
const descs = Object.getOwnPropertyDescriptors(row)
const names = Object.getOwnPropertyNames(row)
const frozen = Object.isFrozen(row)
const sealed = Object.isSealed(row)
const extensible = Object.isExtensible(row)

export default function ObjectIntrospection() {
  return `${Boolean(desc)}:${Boolean(descs)}:${names.length}:${frozen}:${sealed}:${extensible}`
}
