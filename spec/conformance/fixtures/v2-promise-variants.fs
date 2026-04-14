const a = Promise.resolve(1)
const b = Promise.resolve(2)
const all = Promise.all([a, b])
const settled = Promise.allSettled([a, b])
const any = Promise.any([a, b])
const race = Promise.race([a, b])
const rej = Promise.reject(new Error("x")).catch((e) => e?.message || "err")

export default function PromiseVariants() {
  return `${Boolean(all)}:${Boolean(settled)}:${Boolean(any)}:${Boolean(race)}:${Boolean(rej)}`
}
