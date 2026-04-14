const xs = [1, 2, 3, 4]
let sum = 0
xs.forEach((n) => { sum = sum + n })
const evens = xs.filter((n) => n % 2 === 0)
const gt2 = xs.some((n) => n > 2)
const allPos = xs.every((n) => n > 0)

export default function ArrayIteration() {
  return `${sum}:${evens.length}:${gt2}:${allPos}`
}
