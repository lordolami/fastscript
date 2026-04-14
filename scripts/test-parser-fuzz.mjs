import { compileFastScript, parseFastScript } from "../src/fs-parser.mjs";

const TOKENS = [
  "state", "~", "fn", "export", "if", "else", "return", "let", "const", "for", "while", "true", "false", "null",
  "(", ")", "{", "}", "[", "]", ",", ".", "=", "+", "-", "*", "/", "<", ">", "<=", ">=", "==", "===", "!", ";",
  "foo", "bar", "count", "value", "item", "list", "ctx", "load", "GET", "POST", "hello", "world", "1", "2", "3", "0"
];

function rand(n) {
  return Math.floor(Math.random() * n);
}

function randomSnippet(max = 120) {
  const len = 20 + rand(max);
  const out = [];
  for (let i = 0; i < len; i += 1) {
    out.push(TOKENS[rand(TOKENS.length)]);
    if (Math.random() < 0.18) out.push("\n");
  }
  return out.join(" ");
}

const VALID = [
  "state count = 0\nfn add(n){ return count + n }\nexport default function App(){ return String(add(1)) }\n",
  "export async function load(ctx){ return { ok: true } }\nexport default function Page(){ return '<main>ok</main>' }\n",
  "~users = []\nfn pushUser(name){ users.push(name); return users.length }\n"
];

for (const sample of VALID) {
  const compiled = compileFastScript(sample, { file: "valid.fs", mode: "strict", recover: true, inlineSourceMap: true });
  if (!compiled?.code || typeof compiled.code !== "string") throw new Error("valid compile produced no code");
}

const RUNS = 700;
for (let i = 0; i < RUNS; i += 1) {
  const src = randomSnippet();
  try {
    parseFastScript(src, { file: `fuzz-${i}.fs`, mode: "strict", recover: true });
  } catch (error) {
    const code = String(error?.code || "");
    if (!/^FS\d+/.test(code)) {
      throw new Error(`parser fuzz crash at ${i}: ${error?.stack || error}`);
    }
  }
}

console.log(`test-parser-fuzz pass: ${RUNS} randomized programs`);
