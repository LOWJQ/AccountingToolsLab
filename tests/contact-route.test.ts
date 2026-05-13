import assert from "node:assert/strict";
import type { NextRequest } from "next/server";
import { POST } from "../app/api/contact/route";

const tests: Array<[string, () => Promise<void> | void]> = [];

type EnvPatch = Record<string, string | undefined>;

function test(name: string, run: () => Promise<void> | void) {
  tests.push([name, run]);
}

function createPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Low Jia Qing",
    email: "low@example.com",
    topic: "Feedback",
    subject: "Contact form test",
    message: "This is a test message with enough detail.",
    pageUrl: "/contact",
    companyWebsite: "",
    "cf-turnstile-response": "test-token",
    ...overrides
  };
}

function createRequest(body: unknown, userAgent: string): NextRequest {
  return new Request("https://www.accountingtoolslab.com/api/contact", {
    body: typeof body === "string" ? body : JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "user-agent": userAgent
    },
    method: "POST"
  }) as NextRequest;
}

async function readJson(response: Response) {
  return (await response.json()) as Record<string, unknown>;
}

async function withEnv<T>(patch: EnvPatch, run: () => Promise<T>): Promise<T> {
  const original: EnvPatch = {};

  Object.keys(patch).forEach((key) => {
    original[key] = process.env[key];
    const value = patch[key];

    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });

  try {
    return await run();
  } finally {
    Object.keys(patch).forEach((key) => {
      const value = original[key];

      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  }
}

function installSuccessfulFetchMock() {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];

  globalThis.fetch = (async (input) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    calls.push(url);

    if (url.includes("challenges.cloudflare.com")) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "content-type": "application/json" },
        status: 200
      });
    }

    if (url.includes("api.resend.com")) {
      return new Response(JSON.stringify({ id: "email-test-id" }), {
        headers: { "content-type": "application/json" },
        status: 200
      });
    }

    return new Response("Not found", { status: 404 });
  }) as typeof fetch;

  return {
    calls,
    restore: () => {
      globalThis.fetch = originalFetch;
    }
  };
}

test("contact route rejects missing required fields", async () => {
  const response = await POST(createRequest({}, "contact-missing-required"));
  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(body.ok, false);
  assert.equal(body.message, "Please fix the highlighted fields.");
  assert.equal(typeof body.errors, "object");
});

test("contact route rejects invalid email", async () => {
  const response = await POST(
    createRequest(createPayload({ email: "not-an-email" }), "contact-invalid-email")
  );
  const body = await readJson(response);
  const errors = body.errors as Record<string, string>;

  assert.equal(response.status, 400);
  assert.equal(errors.email, "Enter a valid email address.");
});

test("contact route rejects oversized body without relying on content-length", async () => {
  const response = await POST(
    createRequest(JSON.stringify({ value: "x".repeat(20_000) }), "contact-oversized-body")
  );
  const body = await readJson(response);

  assert.equal(response.status, 400);
  assert.equal(body.message, "The message is too large.");
});

test("contact route rejects missing Turnstile token when Turnstile is required", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    throw new Error("Turnstile fetch should not run without a token.");
  }) as typeof fetch;

  try {
    await withEnv({ TURNSTILE_SECRET_KEY: "secret-test" }, async () => {
      const response = await POST(
        createRequest(
          createPayload({ "cf-turnstile-response": "" }),
          "contact-missing-turnstile-token"
        )
      );
      const body = await readJson(response);

      assert.equal(response.status, 400);
      assert.equal(body.message, "Verification failed. Please try again.");
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("contact route handles honeypot spam field without sending", async () => {
  const fetchMock = installSuccessfulFetchMock();

  try {
    const response = await POST(
      createRequest(createPayload({ companyWebsite: "https://spam.example" }), "contact-honeypot")
    );
    const body = await readJson(response);

    assert.equal(response.status, 200);
    assert.deepEqual(body, { ok: true, sent: false });
    assert.deepEqual(fetchMock.calls, []);
  } finally {
    fetchMock.restore();
  }
});

test("contact route rate limiting is testable without waiting real time", async () => {
  const fetchMock = installSuccessfulFetchMock();

  try {
    await withEnv(
      {
        CONTACT_FROM_EMAIL: "AccountingToolsLab <hello@example.com>",
        CONTACT_TO_EMAIL: "owner@example.com",
        RESEND_API_KEY: "resend-test",
        TURNSTILE_SECRET_KEY: "turnstile-test"
      },
      async () => {
        const statuses: number[] = [];

        for (let index = 0; index < 6; index += 1) {
          const response = await POST(
            createRequest(createPayload(), "contact-rate-limit-route-test")
          );
          statuses.push(response.status);
          await response.text();
        }

        assert.deepEqual(statuses, [200, 200, 200, 200, 200, 429]);
      }
    );
  } finally {
    fetchMock.restore();
  }
});

test("contact route reports Turnstile timeout safely", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => {
    throw new DOMException("The operation was aborted.", "AbortError");
  }) as typeof fetch;

  try {
    await withEnv({ TURNSTILE_SECRET_KEY: "turnstile-test" }, async () => {
      const response = await POST(
        createRequest(createPayload(), "contact-turnstile-timeout-test")
      );
      const body = await readJson(response);

      assert.equal(response.status, 400);
      assert.equal(body.message, "Verification took too long. Please try again.");
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("contact route rejects invalid configured recipient email", async () => {
  const fetchMock = installSuccessfulFetchMock();

  try {
    await withEnv(
      {
        CONTACT_FROM_EMAIL: "AccountingToolsLab <hello@example.com>",
        CONTACT_TO_EMAIL: "not-an-email",
        RESEND_API_KEY: "resend-test",
        TURNSTILE_SECRET_KEY: "turnstile-test"
      },
      async () => {
        const response = await POST(
          createRequest(createPayload(), "contact-invalid-recipient-test")
        );
        const body = await readJson(response);

        assert.equal(response.status, 500);
        assert.equal(
          body.message,
          "Message could not be sent. Please email accttoolslab@gmail.com directly."
        );
        assert.deepEqual(fetchMock.calls, ["https://challenges.cloudflare.com/turnstile/v0/siteverify"]);
      }
    );
  } finally {
    fetchMock.restore();
  }
});

test("contact route reports Resend timeout safely", async () => {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];

  globalThis.fetch = (async (input) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    calls.push(url);

    if (url.includes("challenges.cloudflare.com")) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "content-type": "application/json" },
        status: 200
      });
    }

    throw new DOMException("The operation was aborted.", "AbortError");
  }) as typeof fetch;

  try {
    await withEnv(
      {
        CONTACT_FROM_EMAIL: "AccountingToolsLab <hello@example.com>",
        CONTACT_TO_EMAIL: "owner@example.com",
        RESEND_API_KEY: "resend-test",
        TURNSTILE_SECRET_KEY: "turnstile-test"
      },
      async () => {
        const response = await POST(
          createRequest(createPayload(), "contact-resend-timeout-test")
        );
        const body = await readJson(response);

        assert.equal(response.status, 500);
        assert.equal(
          body.message,
          "Message could not be sent. Please email accttoolslab@gmail.com directly."
        );
        assert.deepEqual(calls, [
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          "https://api.resend.com/emails"
        ]);
      }
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
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
