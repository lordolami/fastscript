const base = [1, 2, 3]
const conc = base.concat([4, 5])
const sl = conc.slice(1, 4)
const joined = sl.join(",")
const txt = sl.toString()
const has = sl.includes(3)
const i1 = sl.indexOf(3)
const i2 = sl.lastIndexOf(3)

export default function ArrayNonMutating() {
  return `${joined}:${txt}:${has}:${i1}:${i2}`
}
