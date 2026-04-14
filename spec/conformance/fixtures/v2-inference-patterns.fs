const user = { name: "A", age: 20 }
const { name, age } = user
const [first, second] = [1, 2]
const doubled = [1, 2, 3].map((n) => n * 2)
const total = doubled.reduce((acc, n) => acc + n, 0)

function pick(v) {
  if (typeof v === "string") return v.toUpperCase()
  if (Array.isArray(v)) return v.length
  return null
}

function twice(fn) {
  return (x) => fn(fn(x))
}
const addTwo = (n) => n + 2
const addFour = twice(addTwo)
const out = addFour(5)

export default function InferencePatternsFixture() {
  return `${name}:${age}:${first + second}:${total}:${pick("x")}:${out}`
}
