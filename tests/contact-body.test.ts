import assert from "node:assert/strict";
import { readJsonBodyWithLimit } from "../lib/contact/contact-body";

const tests: Array<[string, () => Promise<void> | void]> = [];

function test(name: string, run: () => Promise<void> | void) {
  tests.push([name, run]);
}

function createJsonRequest(body: string, headers?: HeadersInit): Request {
  return new Request("https://www.accountingtoolslab.com/api/contact", {
    body,
    headers: {
      "content-type": "application/json",
      ...headers
    },
    method: "POST"
  });
}

test("readJsonBodyWithLimit parses valid JSON under the byte limit", async () => {
  const result = await readJsonBodyWithLimit<{ message: string }>(
    createJsonRequest(JSON.stringify({ message: "Hello" })),
    100
  );

  assert.deepEqual(result, {
    ok: true,
    data: { message: "Hello" }
  });
});

test("readJsonBodyWithLimit rejects a large content-length before reading", async () => {
  const result = await readJsonBodyWithLimit(
    createJsonRequest("{}", { "content-length": "101" }),
    100
  );

  assert.deepEqual(result, {
    ok: false,
    message: "The message is too large.",
    status: 400
  });
});

test("readJsonBodyWithLimit rejects oversized streamed bodies without content-length", async () => {
  const result = await readJsonBodyWithLimit(createJsonRequest(JSON.stringify({ value: "x".repeat(120) })), 80);

  assert.deepEqual(result, {
    ok: false,
    message: "The message is too large.",
    status: 400
  });
});

test("readJsonBodyWithLimit rejects invalid JSON", async () => {
  const result = await readJsonBodyWithLimit(createJsonRequest("{bad json"), 100);

  assert.deepEqual(result, {
    ok: false,
    message: "Invalid request body.",
    status: 400
  });
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
