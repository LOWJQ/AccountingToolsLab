import { NextRequest, NextResponse } from "next/server";

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
  formStartedAt?: unknown;
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const unsafeControlPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

// Contact submissions are email-only. If database storage is added later,
// use parameterized queries and never concatenate user input into SQL.
// TODO: Add production-grade rate limiting or CAPTCHA if spam becomes a problem.
export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0);

  if (contentLength > 15000) {
    return NextResponse.json(
      { ok: false, message: "The message is too large." },
      { status: 400 }
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

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
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "accttoolslab@gmail.com";

  if (!apiKey || !from) {
    return NextResponse.json(
      {
        ok: false,
        message:
          process.env.NODE_ENV === "development"
            ? "Contact form email is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL."
            : "Message could not be sent. Please try again later."
      },
      { status: 500 }
    );
  }

  const userAgent = normalizeString(request.headers.get("user-agent"), 500);
  const timestamp = new Date().toISOString();
  const safeTopic = stripHeaderUnsafeChars(result.data.topic);
  const safeSubject = stripHeaderUnsafeChars(result.data.subject);
  const emailSubject = `AccountingToolsLab Contact: ${safeTopic} - ${safeSubject}`;
  const text = buildPlainTextEmail(result.data, timestamp, userAgent || "Unknown");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject: emailSubject,
        text,
        reply_to: stripHeaderUnsafeChars(result.data.email)
      })
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: "Message could not be sent. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Message could not be sent. Please try again later." },
      { status: 500 }
    );
  }
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

  const formStartedAt =
    typeof payload.formStartedAt === "number" ? payload.formStartedAt : 0;

  if (formStartedAt > 0 && Date.now() - formStartedAt < 1500) {
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

  const name = normalizeString(payload.name, 80);
  const email = normalizeString(payload.email, 120).toLowerCase();
  const topic = normalizeString(payload.topic, 40);
  const subject = normalizeString(payload.subject, 120);
  const message = normalizeString(payload.message, 3000);
  const pageUrl = normalizeString(payload.pageUrl, 300);

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

function normalizeString(value: unknown, maxLength: number): string {
  const stringValue = getString(value);

  if (stringValue.length > maxLength) {
    return stringValue.trim();
  }

  return stringValue.trim();
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
