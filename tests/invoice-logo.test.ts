import assert from "node:assert/strict";
import { validateLogoFile } from "../lib/invoice/invoice-logo";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

function createFile(name: string, type: string, size = 10): File {
  return new File([new Uint8Array(size)], name, { type });
}

test("accepts PNG logo", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.png", "image/png")), { ok: true });
});

test("accepts JPG logo", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.jpg", "image/jpeg")), { ok: true });
});

test("accepts JPEG logo", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.jpeg", "image/jpeg")), { ok: true });
});

test("rejects SVG logo", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.svg", "image/svg+xml")), {
    ok: false,
    error: "Please upload a PNG or JPG logo."
  });
});

test("rejects GIF logo", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.gif", "image/gif")), {
    ok: false,
    error: "Please upload a PNG or JPG logo."
  });
});

test("rejects PDF logo", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.pdf", "application/pdf")), {
    ok: false,
    error: "Please upload a PNG or JPG logo."
  });
});

test("rejects files over 2MB", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.png", "image/png", 2 * 1024 * 1024 + 1)), {
    ok: false,
    error: "Logo file size must be 2MB or less."
  });
});

test("rejects missing MIME type", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.png", "")), {
    ok: false,
    error: "Please upload a PNG or JPG logo."
  });
});

test("rejects invalid MIME type", () => {
  assert.deepEqual(validateLogoFile(createFile("logo.txt", "text/plain")), {
    ok: false,
    error: "Please upload a PNG or JPG logo."
  });
});
