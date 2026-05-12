export const CONTACT_MAX_BODY_BYTES = 15_000;

export type LimitedJsonBodyResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; status: number };

export async function readJsonBodyWithLimit<T = unknown>(
  request: Request,
  maxBytes = CONTACT_MAX_BODY_BYTES
): Promise<LimitedJsonBodyResult<T>> {
  const contentLength = readContentLength(request.headers.get("content-length"));

  if (contentLength !== null && contentLength > maxBytes) {
    return {
      ok: false,
      message: "The message is too large.",
      status: 400
    };
  }

  if (!request.body) {
    return {
      ok: false,
      message: "Invalid request body.",
      status: 400
    };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      receivedBytes += value.byteLength;

      if (receivedBytes > maxBytes) {
        await reader.cancel();
        return {
          ok: false,
          message: "The message is too large.",
          status: 400
        };
      }

      chunks.push(value);
    }
  } catch {
    return {
      ok: false,
      message: "Invalid request body.",
      status: 400
    };
  }

  try {
    return {
      ok: true,
      data: JSON.parse(decodeUtf8(chunks, receivedBytes)) as T
    };
  } catch {
    return {
      ok: false,
      message: "Invalid request body.",
      status: 400
    };
  }
}

function readContentLength(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null;
}

function decodeUtf8(chunks: Uint8Array[], byteLength: number): string {
  const bodyBytes = new Uint8Array(byteLength);
  let offset = 0;

  chunks.forEach((chunk) => {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
  });

  return new TextDecoder().decode(bodyBytes);
}
