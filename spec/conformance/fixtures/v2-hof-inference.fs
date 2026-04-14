function twice(fn) {
  return (x) => fn(fn(x))
}

const addTwo = (n) => n + 2
const addFour = twice(addTwo)
const out = addFour(5)

export default function HofInference() {
  return `${out}`
}
