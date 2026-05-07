export const INVOICE_LOGO_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
export const INVOICE_LOGO_MAX_STORED_WIDTH = 500;
export const INVOICE_LOGO_MAX_STORED_HEIGHT = 200;
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Invalid image data."));
    };
    reader.onerror = () => reject(new Error("Logo could not be processed."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Logo could not be loaded."));
    image.src = dataUrl;
  });
}

function getDataUrlByteSize(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

export async function processLogoFile(file: File): Promise<ProcessLogoResult> {
  const validation = validateLogoFile(file);

  if (!validation.ok) {
    return validation;
  }

  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof FileReader === "undefined" ||
    typeof Image === "undefined"
  ) {
    return { ok: false, error: "Logo could not be processed. Please try another image." };
  }

  try {
    const sourceDataUrl = await readFileAsDataUrl(file);
    const image = await loadImage(sourceDataUrl);
    const scale = Math.min(
      1,
      INVOICE_LOGO_MAX_STORED_WIDTH / image.naturalWidth,
      INVOICE_LOGO_MAX_STORED_HEIGHT / image.naturalHeight
    );
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return { ok: false, error: "Logo could not be processed. Please try another image." };
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(image, 0, 0, width, height);

    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
    const dataUrl = canvas.toDataURL(outputType, outputType === "image/jpeg" ? 0.85 : undefined);

    if (!dataUrl.startsWith("data:image/") || getDataUrlByteSize(dataUrl) > INVOICE_LOGO_MAX_DATA_URL_BYTES) {
      return { ok: false, error: "Logo could not be processed. Please try another image." };
    }

    return { ok: true, dataUrl };
  } catch {
    return { ok: false, error: "Logo could not be processed. Please try another image." };
  }
}
