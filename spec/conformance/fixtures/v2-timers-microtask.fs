const id1 = setTimeout(() => "x", 10)
clearTimeout(id1)
const id2 = setInterval(() => "y", 20)
clearInterval(id2)
queueMicrotask(() => "z")

export default function TimersMicrotask() {
  return `${id1}:${id2}`
}
