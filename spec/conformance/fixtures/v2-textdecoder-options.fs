const bytes = new TextEncoder().encode("fastscript")
const dec = new TextDecoder("utf-8", { fatal: false, ignoreBOM: true })
const txt = dec.decode(bytes)

export default function TextDecoderOptions() {
  return `${txt}:${dec.encoding}`
}
