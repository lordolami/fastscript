const e = Number.EPSILON
const max = Number.MAX_SAFE_INTEGER
const min = Number.MIN_SAFE_INTEGER
const nan = Number.NaN

export default function NumberConstants() {
  return `${Boolean(e)}:${Boolean(max)}:${Boolean(min)}:${Number.isNaN(nan)}`
}
