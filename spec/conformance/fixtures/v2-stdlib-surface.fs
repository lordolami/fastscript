const nums = Array.from([1, 2, 3])
const isList = Array.isArray(nums)
const entries = Object.entries({ a: 1, b: 2 })
const joined = JSON.stringify({ nums, isList, entries })
const parsed = JSON.parse(joined)
const now = Date.now()
const biggest = Math.max(now, 0)
const waitAll = Promise.all([Promise.resolve(1), Promise.resolve(2)])

export default function StdlibSurface() {
  return `${biggest}:${parsed?.nums?.length}:${String(waitAll)}`
}
