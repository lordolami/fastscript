~count = 0
state title = "Hello"
export fn add(a, b) {
  return a + b + count
}

const html = `<h1>${title}</h1>`
