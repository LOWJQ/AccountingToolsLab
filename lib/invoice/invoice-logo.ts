import { getDataUrlByteSize, resizeImageFile } from "../utils/image-file";

const INVOICE_LOGO_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const INVOICE_LOGO_MAX_STORED_WIDTH = 500;
const INVOICE_LOGO_MAX_STORED_HEIGHT = 200;
export const INVOICE_LOGO_MAX_DATA_URL_BYTES = 500 * 1024;

const acceptedLogoTypes = new Set(["image/png", "image/jpeg"]);

type LogoResult = { ok: true } | { ok: false; error: string };
type ProcessLogoResult = { ok: true; dataUrl: string } | { ok: false; error: string };

export function validateLogoFile(file: File): LogoResult {
  if (!acceptedLogoTypes.has(file.type)) {
    return { ok: false, error: "Please upload a PNG or JPG logo." };
  }

  if (file.size > INVOICE_LOGO_MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "Logo file size must be 2MB or less." };
  }

  return { ok: true };
}

export async function processLogoFile(file: File): Promise<ProcessLogoResult> {
  const validation = validateLogoFile(file);

  if (!validation.ok) {
    return validation;
  }

  try {
    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const dataUrl = await resizeImageFile(file, {
      maxWidth: INVOICE_LOGO_MAX_STORED_WIDTH,
      maxHeight: INVOICE_LOGO_MAX_STORED_HEIGHT,
      type: outputType,
      quality: outputType === "image/jpeg" ? 0.85 : undefined
    });

    if (!dataUrl || !dataUrl.startsWith("data:image/") || getDataUrlByteSize(dataUrl) > INVOICE_LOGO_MAX_DATA_URL_BYTES) {
      return { ok: false, error: "Logo could not be processed. Please try another image." };
    }

    return { ok: true, dataUrl };
  } catch {
    return { ok: false, error: "Logo could not be processed. Please try another image." };
  }
}
