type ResizeImageOptions = {
  maxWidth: number;
  maxHeight: number;
  type: "image/png" | "image/jpeg";
  quality?: number;
  imageSmoothingEnabled?: boolean;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string"
      ? resolve(reader.result)
      : reject(new Error("Invalid image data."));
    reader.onerror = () => reject(new Error("Image could not be read."));
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded."));
    image.src = dataUrl;
  });
}

export function getDataUrlByteSize(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.ceil((base64.length * 3) / 4);
}

/** Shared local image pipeline. Callers retain their validation and error text. */
export async function resizeImageFile(file: File, options: ResizeImageOptions): Promise<string | null> {
  if (typeof window === "undefined" || typeof document === "undefined" || typeof FileReader === "undefined" || typeof Image === "undefined") return null;

  const image = await loadImage(await readFileAsDataUrl(file));
  const scale = Math.min(1, options.maxWidth / image.naturalWidth, options.maxHeight / image.naturalHeight);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  canvas.width = width;
  canvas.height = height;
  if (options.imageSmoothingEnabled !== undefined) context.imageSmoothingEnabled = options.imageSmoothingEnabled;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL(options.type, options.quality);
}
