const xs = [1, 2, 3]
xs.push(4)
const last = xs.pop()
xs.unshift(0)
const first = xs.shift()
xs.splice(1, 0, 9)
xs.reverse()
xs.sort()
xs.fill(7, 0, 1)
xs.copyWithin(1, 0, 1)

export default function ArrayMutating() {
  return `${first}:${last}:${xs.length}`
}
