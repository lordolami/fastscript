const xs = [1, 2, 3]
const left = xs.reduce((acc, n) => acc + n, 0)
const right = xs.reduceRight((acc, n) => acc + n, 0)

export default function ArrayReduceRight() {
  return `${left}:${right}`
}
