type User = { id: string }
interface Payload {
  id: string
}

const user = { id: "u1" }
export default function View() {
  return user.id
}
