import assert from "node:assert/strict";
import { checkRateLimit, MemoryRateLimitStore } from "../lib/contact/rate-limit";

const tests: Array<[string, () => Promise<void> | void]> = [];

function test(name: string, run: () => Promise<void> | void) {
  tests.push([name, run]);
}

test("memory rate limit allows requests up to the configured max", async () => {
  const store = new MemoryRateLimitStore();
  const first = await checkRateLimit({
    key: "client-a",
    maxRequests: 2,
    now: 1000,
    store,
    windowMs: 60_000
  });
  const second = await checkRateLimit({
    key: "client-a",
    maxRequests: 2,
    now: 1001,
    store,
    windowMs: 60_000
  });

  assert.equal(first.limited, false);
  assert.equal(second.limited, false);
  assert.equal(second.remaining, 0);
});

test("memory rate limit blocks after the configured max", async () => {
  const store = new MemoryRateLimitStore();

  await checkRateLimit({ key: "client-a", maxRequests: 1, now: 1000, store, windowMs: 60_000 });
  const blocked = await checkRateLimit({
    key: "client-a",
    maxRequests: 1,
    now: 1001,
    store,
    windowMs: 60_000
  });

  assert.equal(blocked.limited, true);
});

test("memory rate limit resets after the window expires", async () => {
  const store = new MemoryRateLimitStore();

  await checkRateLimit({ key: "client-a", maxRequests: 1, now: 1000, store, windowMs: 60_000 });
  const nextWindow = await checkRateLimit({
    key: "client-a",
    maxRequests: 1,
    now: 61_001,
    store,
    windowMs: 60_000
  });

  assert.equal(nextWindow.limited, false);
  assert.equal(nextWindow.remaining, 0);
});

async function runTests() {
  for (const [name, run] of tests) {
    await run();
    console.log(`PASS ${name}`);
  }
}

runTests().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
