const e1 = new TypeError("a")
const e2 = new ReferenceError("b")
const e3 = new SyntaxError("c")
const e4 = new RangeError("d")

export default function ErrorVariants() {
  return `${e1.message}:${e2.message}:${e3.message}:${e4.message}`
}
