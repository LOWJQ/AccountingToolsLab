import assert from "node:assert/strict";
import { validatePaymentQrFile } from "../lib/invoice/invoice-payment-qr";

function test(name: string, run: () => void) {
  run();
  console.log(`PASS ${name}`);
}

function createFile(name: string, type: string, size = 10): File {
  return new File([new Uint8Array(size)], name, { type });
}

test("accepts PNG payment QR", () => {
  assert.deepEqual(validatePaymentQrFile(createFile("payment-qr.png", "image/png")), {
    ok: true
  });
});

test("accepts JPG payment QR", () => {
  assert.deepEqual(validatePaymentQrFile(createFile("payment-qr.jpg", "image/jpeg")), {
    ok: true
  });
});

test("accepts JPEG payment QR", () => {
  assert.deepEqual(validatePaymentQrFile(createFile("payment-qr.jpeg", "image/jpeg")), {
    ok: true
  });
});

test("rejects SVG payment QR", () => {
  assert.deepEqual(validatePaymentQrFile(createFile("payment-qr.svg", "image/svg+xml")), {
    ok: false,
    error: "Please upload a PNG or JPG payment QR image."
  });
});

test("rejects GIF payment QR", () => {
  assert.deepEqual(validatePaymentQrFile(createFile("payment-qr.gif", "image/gif")), {
    ok: false,
    error: "Please upload a PNG or JPG payment QR image."
  });
});

test("rejects PDF payment QR", () => {
  assert.deepEqual(validatePaymentQrFile(createFile("payment-qr.pdf", "application/pdf")), {
    ok: false,
    error: "Please upload a PNG or JPG payment QR image."
  });
});

test("rejects non-image payment QR", () => {
  assert.deepEqual(validatePaymentQrFile(createFile("payment-qr.txt", "text/plain")), {
    ok: false,
    error: "Please upload a PNG or JPG payment QR image."
  });
});

test("rejects payment QR over 2MB", () => {
  assert.deepEqual(
    validatePaymentQrFile(createFile("payment-qr.png", "image/png", 2 * 1024 * 1024 + 1)),
    {
      ok: false,
      error: "Payment QR image must be 2MB or less."
    }
  );
});

test("rejects payment QR with missing MIME type", () => {
  assert.deepEqual(validatePaymentQrFile(createFile("payment-qr.png", "")), {
    ok: false,
    error: "Please upload a PNG or JPG payment QR image."
  });
});
