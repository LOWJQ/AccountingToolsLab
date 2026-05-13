import { NextRequest, NextResponse } from "next/server";
import { readJsonBodyWithLimit } from "../../../lib/contact/contact-body";
import {
  checkRateLimit,
  MemoryRateLimitStore,
  type RateLimitStore
} from "../../../lib/contact/rate-limit";

const allowedTopics = [
  "Feedback",
  "Report an issue",
  "Suggest a tool",
  "General question"
] as const;

const allowedTopicSet = new Set<string>(allowedTopics);

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  topic?: unknown;
  subject?: unknown;
  message?: unknown;
  pageUrl?: unknown;
  companyWebsite?: unknown;
  "cf-turnstile-response"?: unknown;
};

type NormalizedContact = {
  name: string;
  email: string;
  topic: string;
  subject: string;
  message: string;
  pageUrl: string;
};

type ValidationResult =
  | { ok: true; data: NormalizedContact; isSpam: boolean }
  | { ok: false; errors: Record<string, string> };

type TurnstileVerificationResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const unsafeControlPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const rateLimitWindowMs = 15 * 60 * 1000;
const rateLimitMaxRequests = 5;
const defaultTurnstileVerificationTimeoutMs = 8_000;
const defaultResendEmailTimeoutMs = 10_000;
const contactRateLimitStore: RateLimitStore = new MemoryRateLimitStore();

// Contact submissions are email-only. If database storage is added later,
// use parameterized queries and never concatenate user input into SQL.
// The default limiter store is in-memory so local/dev/test keep working without
// credentials. Production can replace contactRateLimitStore with a Redis/KV
// implementation of RateLimitStore for cross-instance enforcement.
export async function POST(request: NextRequest) {
  const bodyResult = await readJsonBodyWithLimit<ContactPayload>(request);

  if (!bodyResult.ok) {
    return NextResponse.json(
      { ok: false, message: bodyResult.message },
      { status: bodyResult.status }
    );
  }

  const payload = bodyResult.data;
  const result = validatePayload(payload);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: "Please fix the highlighted fields.",
        errors: result.errors
      },
      { status: 400 }
    );
  }

  if (result.isSpam) {
    return NextResponse.json({ ok: true, sent: false }, { status: 200 });
  }

  if (await isRateLimited(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests. Please try again later.",
        message: "Too many requests. Please try again later."
      },
      { status: 429 }
    );
  }

  const turnstileToken = getString(payload["cf-turnstile-response"]).trim();
  const turnstileVerification = await verifyTurnstileToken(turnstileToken, request);

  if (!turnstileVerification.success) {
    return NextResponse.json(
      {
        ok: false,
        message: getTurnstileFailureMessage(turnstileVerification)
      },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.CONTACT_FROM_EMAIL || "AccountingToolsLab <onboarding@resend.dev>";
  const recipientResult = parseRecipientEmails(process.env.CONTACT_TO_EMAIL);

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        message:
          process.env.NODE_ENV === "development"
            ? "Contact form email is not configured. Set RESEND_API_KEY."
            : "Message could not be sent. Please email accttoolslab@gmail.com directly."
      },
      { status: 500 }
    );
  }

  if (!recipientResult.ok) {
    console.error("Invalid CONTACT_TO_EMAIL.");

    return NextResponse.json(
      {
        ok: false,
        message: "Message could not be sent. Please email accttoolslab@gmail.com directly."
      },
      { status: 500 }
    );
  }

  if (!isValidSenderValue(from)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Invalid CONTACT_FROM_EMAIL. Use an email address or Name <email> format.");
    } else {
      console.error("Invalid CONTACT_FROM_EMAIL.");
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Message could not be sent. Please email accttoolslab@gmail.com directly."
      },
      { status: 500 }
    );
  }

  const userAgent = normalizeHeaderValue(request.headers.get("user-agent"), 500);
  const timestamp = new Date().toISOString();
  const safeTopic = stripHeaderUnsafeChars(result.data.topic);
  const safeSubject = stripHeaderUnsafeChars(result.data.subject);
  const emailSubject = `AccountingToolsLab Contact: ${safeTopic} - ${safeSubject}`;
  const text = buildPlainTextEmail(result.data, timestamp, userAgent || "Unknown");
  const timeout = createTimeoutSignal(
    getProviderTimeoutMs("CONTACT_RESEND_TIMEOUT_MS", defaultResendEmailTimeoutMs)
  );

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: recipientResult.emails,
        subject: emailSubject,
        text,
        reply_to: stripHeaderUnsafeChars(result.data.email)
      }),
      signal: timeout.signal
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (process.env.NODE_ENV !== "production") {
        console.error("Resend contact email failed", {
          status: response.status,
          body: errorText
        });
      } else {
        console.error("Resend contact email failed", {
          status: response.status
        });
      }

      return NextResponse.json(
        {
          ok: false,
          message: "Message could not be sent. Please email accttoolslab@gmail.com directly."
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (isAbortError(error)) {
      console.error("Resend contact email timed out.");
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Message could not be sent. Please email accttoolslab@gmail.com directly."
      },
      { status: 500 }
    );
  } finally {
    timeout.clear();
  }
}

async function isRateLimited(request: NextRequest): Promise<boolean> {
  const result = await checkRateLimit({
    key: getRateLimitKey(request),
    maxRequests: rateLimitMaxRequests,
    store: contactRateLimitStore,
    windowMs: rateLimitWindowMs
  });

  return result.limited;
}

function createTimeoutSignal(timeoutMs: number): { clear: () => void; signal: AbortSignal } {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    clear: () => clearTimeout(timeoutId),
    signal: controller.signal
  };
}

function getProviderTimeoutMs(envName: string, fallbackMs: number): number {
  const value = Number(process.env[envName]);

  return Number.isFinite(value) && value >= 1_000 && value <= 30_000
    ? value
    : fallbackMs;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function getTurnstileFailureMessage({
  isConfigError,
  timedOut
}: {
  isConfigError?: boolean;
  timedOut?: boolean;
}): string {
  if (isConfigError && process.env.NODE_ENV === "development") {
    return "Turnstile is not configured. Set TURNSTILE_SECRET_KEY.";
  }

  if (timedOut) {
    return "Verification took too long. Please try again.";
  }

  return "Verification failed. Please try again.";
}

function getRateLimitKey(request: NextRequest): string {
  const clientIp = getTrustedClientIp(request) || "untrusted-ip";
  const userAgent = normalizeHeaderValue(request.headers.get("user-agent"), 160) || "unknown-agent";

  return `${clientIp}:${userAgent}`;
}

async function verifyTurnstileToken(
  token: string,
  request: NextRequest
): Promise<{ success: boolean; isConfigError?: boolean; timedOut?: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    return { success: false, isConfigError: true };
  }

  if (!token) {
    return { success: false };
  }

  const formData = new URLSearchParams();
  formData.set("secret", secret);
  formData.set("response", token);

  const remoteIp = getTrustedClientIp(request);

  if (remoteIp) {
    formData.set("remoteip", remoteIp);
  }

  const timeout = createTimeoutSignal(
    getProviderTimeoutMs("CONTACT_TURNSTILE_TIMEOUT_MS", defaultTurnstileVerificationTimeoutMs)
  );

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData,
      signal: timeout.signal
    });
    const data = (await response.json()) as TurnstileVerificationResponse;

    return { success: response.ok && data.success === true };
  } catch (error) {
    return { success: false, timedOut: isAbortError(error) };
  } finally {
    timeout.clear();
  }
}

function getTrustedClientIp(request: NextRequest): string {
  if (!shouldTrustProxyHeaders()) {
    return "";
  }

  const candidates = [
    request.headers.get("x-forwarded-for")?.split(",")[0],
    request.headers.get("x-real-ip")
  ];

  return candidates
    .map((value) => normalizeHeaderValue(value, 80))
    .find((value) => isSafeIpLikeValue(value)) ?? "";
}

function shouldTrustProxyHeaders(): boolean {
  // x-forwarded-for can be spoofed when a Node server is directly exposed.
  // Trust it only on Vercel or when self-hosting behind a trusted proxy that
  // strips incoming proxy headers before setting its own.
  return process.env.VERCEL === "1" || process.env.CONTACT_TRUST_PROXY_HEADERS === "true";
}

function isSafeIpLikeValue(value: string): boolean {
  return /^[a-fA-F0-9:.%-]{3,80}$/.test(value);
}

function validatePayload(payload: ContactPayload): ValidationResult {
  const errors: Record<string, string> = {};
  const rawHoneypot = getString(payload.companyWebsite).trim();

  if (rawHoneypot.length > 0) {
    return {
      ok: true,
      isSpam: true,
      data: {
        name: "",
        email: "",
        topic: "",
        subject: "",
        message: "",
        pageUrl: ""
      }
    };
  }

  if (rawHoneypot.length > 200) {
    return {
      ok: true,
      isSpam: true,
      data: {
        name: "",
        email: "",
        topic: "",
        subject: "",
        message: "",
        pageUrl: ""
      }
    };
  }

  const name = normalizeString(payload.name);
  const email = normalizeString(payload.email).toLowerCase();
  const topic = normalizeString(payload.topic);
  const subject = normalizeString(payload.subject);
  const message = normalizeString(payload.message);
  const pageUrl = normalizeString(payload.pageUrl);

  validateStringField({
    errors,
    field: "name",
    label: "name",
    maxLength: 80,
    minLength: 2,
    rawValue: payload.name,
    value: name
  });

  if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isStringWithinLimit(payload.email, 120)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isAllowedTopic(topic)) {
    errors.topic = "Choose a topic.";
  }

  validateStringField({
    errors,
    field: "subject",
    label: "subject",
    maxLength: 120,
    minLength: 3,
    rawValue: payload.subject,
    value: subject
  });

  validateStringField({
    errors,
    field: "message",
    label: "message",
    maxLength: 3000,
    minLength: 10,
    rawValue: payload.message,
    value: message,
    allowLineBreaks: true
  });

  if (!isStringWithinLimit(payload.pageUrl, 300)) {
    errors.pageUrl = "Keep the page or tool URL under 300 characters.";
  } else if (pageUrl && !isSafeOptionalUrl(pageUrl)) {
    errors.pageUrl = "Enter a relative path, http URL, or https URL.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    isSpam: false,
    data: { name, email, topic, subject, message, pageUrl }
  };
}

function validateStringField({
  allowLineBreaks = false,
  errors,
  field,
  label,
  maxLength,
  minLength,
  rawValue,
  value
}: {
  allowLineBreaks?: boolean;
  errors: Record<string, string>;
  field: string;
  label: string;
  maxLength: number;
  minLength: number;
  rawValue: unknown;
  value: string;
}) {
  if (!isStringWithinLimit(rawValue, maxLength)) {
    errors[field] = `Enter a ${label} between ${minLength} and ${maxLength} characters.`;
    return;
  }

  if (value.length < minLength || value.length > maxLength) {
    errors[field] = `Enter a ${label} between ${minLength} and ${maxLength} characters.`;
    return;
  }

  if (hasUnsafeControlCharacters(value, allowLineBreaks)) {
    errors[field] = `Remove unsupported characters from the ${label}.`;
  }
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeString(value: unknown): string {
  return getString(value).trim();
}

function normalizeHeaderValue(value: unknown, maxLength: number): string {
  return stripHeaderUnsafeChars(normalizeString(value)).slice(0, maxLength);
}

function stripHeaderUnsafeChars(value: string): string {
  return value.replace(/[\r\n]/g, " ").replace(/\s+/g, " ").trim();
}

function isValidEmail(value: string): boolean {
  return (
    value.length <= 120 &&
    emailPattern.test(value) &&
    !/[\r\n]/.test(value) &&
    !hasUnsafeControlCharacters(value, false)
  );
}

function isAllowedTopic(value: string): boolean {
  return allowedTopicSet.has(value);
}

function isSafeOptionalUrl(value: string): boolean {
  if (!value) {
    return true;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return !hasUnsafeControlCharacters(value, false);
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseRecipientEmails(
  value: string | undefined
): { ok: true; emails: string[] } | { ok: false } {
  if (!value) {
    return { ok: true, emails: ["accttoolslab@gmail.com"] };
  }

  const recipients = value
    .split(",")
    .map((email) => stripHeaderUnsafeChars(email).trim())
    .filter((email) => email.length > 0);

  if (recipients.length === 0 || recipients.some((email) => !isValidEmail(email))) {
    return { ok: false };
  }

  return { ok: true, emails: recipients };
}

function isValidSenderValue(value: string): boolean {
  if (
    !value ||
    value.includes("your_verified_resend_sender") ||
    value.includes("email@example.com")
  ) {
    return false;
  }

  const trimmedValue = stripHeaderUnsafeChars(value);
  const namedEmailMatch = trimmedValue.match(/^.+<([^<>]+)>$/);

  if (namedEmailMatch) {
    return isValidEmail(namedEmailMatch[1].trim());
  }

  return isValidEmail(trimmedValue);
}

function isStringWithinLimit(value: unknown, maxLength: number): boolean {
  return typeof value === "string" && value.trim().length <= maxLength;
}

function hasUnsafeControlCharacters(value: string, allowLineBreaks: boolean): boolean {
  const normalized = allowLineBreaks ? value.replace(/[\r\n\t]/g, "") : value;
  return unsafeControlPattern.test(normalized);
}

function buildPlainTextEmail(
  data: NormalizedContact,
  timestamp: string,
  userAgent: string
): string {
  return [
    "New AccountingToolsLab contact message",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Topic: ${data.topic}`,
    `Subject: ${data.subject}`,
    data.pageUrl ? `Page/tool URL: ${data.pageUrl}` : "Page/tool URL: Not provided",
    `Submitted at: ${timestamp}`,
    `User agent: ${userAgent}`,
    "",
    "Message:",
    data.message
  ].join("\n");
}
