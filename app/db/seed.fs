import {seedPlatformCollections} from "../lib/platform-alpha.mjs";
import {seedBillingCollections} from "../lib/billing.mjs";
export async function seed(db) {
  db.transaction(tx => {
    tx.collection("posts").set("hello", {
      id: "hello",
      title: "First Post",
      published: true
    });
    seedBillingCollections(tx);
    seedPlatformCollections(tx);
  });
}
