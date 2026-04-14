const p = Promise.resolve(1)
const a = p.then((n) => n + 1)
const b = a.catch((e) => e)
const c = b.finally(() => "done")

export default function PromiseInstance() {
  return `${Boolean(c)}`
}
