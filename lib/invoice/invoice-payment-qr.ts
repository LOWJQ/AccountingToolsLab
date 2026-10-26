import { getDataUrlByteSize, resizeImageFile } from "../utils/image-file";

const INVOICE_PAYMENT_QR_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
export const INVOICE_PAYMENT_QR_MAX_DATA_URL_BYTES = 800 * 1024;
const INVOICE_PAYMENT_QR_MAX_STORED_WIDTH = 512;
const INVOICE_PAYMENT_QR_MAX_STORED_HEIGHT = 512;

const acceptedPaymentQrTypes = new Set(["image/png", "image/jpeg"]);

type PaymentQrResult = { ok: true } | { ok: false; error: string };
type ProcessPaymentQrResult = { ok: true; dataUrl: string } | { ok: false; error: string };

export function validatePaymentQrFile(file: File): PaymentQrResult {
  if (!acceptedPaymentQrTypes.has(file.type)) {
    return { ok: false, error: "Please upload a PNG or JPG payment QR image." };
  }

  if (file.size > INVOICE_PAYMENT_QR_MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "Payment QR image must be 2MB or less." };
  }

  return { ok: true };
}

export async function processPaymentQrFile(file: File): Promise<ProcessPaymentQrResult> {
  const validation = validatePaymentQrFile(file);

  if (!validation.ok) {
    return validation;
  }

  try {
    const dataUrl = await resizeImageFile(file, {
      maxWidth: INVOICE_PAYMENT_QR_MAX_STORED_WIDTH,
      maxHeight: INVOICE_PAYMENT_QR_MAX_STORED_HEIGHT,
      type: "image/png",
      imageSmoothingEnabled: false
    });

    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      return {
        ok: false,
        error: "Payment QR image could not be processed. Please try another image."
      };
    }

    if (getDataUrlByteSize(dataUrl) > INVOICE_PAYMENT_QR_MAX_DATA_URL_BYTES) {
      return {
        ok: false,
        error: "Payment QR image is too large after processing. Please upload a smaller PNG or JPG image."
      };
    }

    return { ok: true, dataUrl };
  } catch {
    return {
      ok: false,
      error: "Payment QR image could not be processed. Please try another image."
    };
  }
}
