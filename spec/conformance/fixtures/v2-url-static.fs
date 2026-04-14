const blob = new Blob(["hello"])
const id = URL.createObjectURL(blob)
URL.revokeObjectURL(id)

export default function UrlStatic() {
  return `${Boolean(id)}`
}
