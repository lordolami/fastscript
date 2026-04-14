import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import { isReplay, readRawBody, signPayload, verifySignature } from "../src/webhook.mjs";
import { createLocalStorage } from "../src/storage.mjs";

const payload = Buffer.from('{"ok":true}');
const secret = "topsecret";
const sig = signPayload(payload, secret);
assert.equal(verifySignature(payload, sig, secret), true);
assert.equal(verifySignature(payload, sig, "bad"), false);
assert.equal(isReplay(Math.floor(Date.now() / 1000), 300), false);

let webhookTooLarge = false;
try {
  await readRawBody(Readable.from(["abcdef"]), { maxBytes: 3 });
} catch (e) {
  webhookTooLarge = true;
  assert.equal(e.status, 413);
}
assert.equal(webhookTooLarge, true);

const dir = resolve(".tmp-storage-tests");
rmSync(dir, { recursive: true, force: true });
const store = createLocalStorage({ dir });
store.put("a/b.txt", Buffer.from("hello"));
assert.equal(String(store.get("a/b.txt")), "hello");
store.delete("a/b.txt");
assert.equal(store.get("a/b.txt"), null);

let blockedPath = false;
try {
  store.put("../escape.txt", Buffer.from("x"));
} catch (e) {
  blockedPath = true;
  assert.equal(e.status, 400);
}
assert.equal(blockedPath, true);

console.log("test-webhook-storage pass");
