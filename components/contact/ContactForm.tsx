"use client";

import Script from "next/script";
import { Check, ChevronDown } from "lucide-react";
import {
  FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import type { ReactNode } from "react";

const topics = [
  "Feedback",
  "Report an issue",
  "Suggest a tool",
  "General question"
] as const;

type Topic = (typeof topics)[number];

type FormState = {
  name: string;
  email: string;
  topic: "" | Topic;
  subject: string;
  message: string;
  pageUrl: string;
  companyWebsite: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  name: "",
  email: "",
  topic: "",
  subject: "",
  message: "",
  pageUrl: "",
  companyWebsite: ""
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

declare global {
  interface Window {
    turnstile?: {
      reset: () => void;
    };
  }
}

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const subject = form.subject.trim();
  const message = form.message.trim();
  const pageUrl = form.pageUrl.trim();

  if (name.length < 2 || name.length > 80) {
    errors.name = "Enter a name between 2 and 80 characters.";
  }

  if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.topic) {
    errors.topic = "Choose a topic.";
  }

  if (subject.length < 3 || subject.length > 120) {
    errors.subject = "Enter a subject between 3 and 120 characters.";
  }

  if (message.length < 10 || message.length > 3000) {
    errors.message = "Enter a message between 10 and 3000 characters.";
  }

  if (pageUrl.length > 300) {
    errors.pageUrl = "Keep the page or tool URL under 300 characters.";
  } else if (pageUrl && !isSafeOptionalUrl(pageUrl)) {
    errors.pageUrl = "Enter a relative path, http URL, or https URL.";
  }

  return errors;
}

function isSafeOptionalUrl(value: string) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function TopicSelect({
  error,
  id,
  onChange,
  value
}: {
  error?: string;
  id: string;
  onChange: (value: "" | Topic) => void;
  value: "" | Topic;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = topics.findIndex((topic) => topic === value);
  const [activeIndex, setActiveIndex] = useState(selectedIndex >= 0 ? selectedIndex : 0);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();

  function openSelector(index = selectedIndex >= 0 ? selectedIndex : 0) {
    setIsOpen(true);
    setActiveIndex(Math.min(Math.max(index, 0), topics.length - 1));
  }

  function closeSelector({ returnFocus = true }: { returnFocus?: boolean } = {}) {
    setIsOpen(false);

    if (returnFocus) {
      window.requestAnimationFrame(() => {
        buttonRef.current?.focus();
      });
    }
  }

  function moveActiveOption(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), topics.length - 1);
    setActiveIndex(nextIndex);
    optionRefs.current[nextIndex]?.scrollIntoView({ block: "nearest" });
  }

  function selectTopic(index: number) {
    const topic = topics[index];

    if (!topic) {
      return;
    }

    onChange(topic);
    closeSelector();
  }

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        closeSelector({ returnFocus: false });
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [selectedIndex]);

  function handleButtonKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (isOpen) {
        moveActiveOption(activeIndex + 1);
      } else {
        openSelector(selectedIndex >= 0 ? selectedIndex : 0);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (isOpen) {
        moveActiveOption(activeIndex - 1);
      } else {
        openSelector(selectedIndex >= 0 ? selectedIndex : topics.length - 1);
      }
    } else if (event.key === "Home") {
      event.preventDefault();
      openSelector(0);
    } else if (event.key === "End") {
      event.preventDefault();
      openSelector(topics.length - 1);
    } else if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      if (isOpen) {
        selectTopic(activeIndex);
      } else {
        openSelector(selectedIndex >= 0 ? selectedIndex : 0);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeSelector();
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <input name="topic" type="hidden" value={value} />
      <button
        aria-controls={isOpen ? listboxId : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`${inputClassName} flex items-center justify-between gap-3 text-left ${
          error ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100" : ""
        }`}
        id={id}
        onClick={() => {
          if (isOpen) {
            closeSelector();
          } else {
            openSelector(selectedIndex >= 0 ? selectedIndex : 0);
          }
        }}
        onKeyDown={handleButtonKeyDown}
        ref={buttonRef}
        type="button"
      >
        <span className={value ? "text-stone-900" : "text-stone-400"}>
          {value || "Choose a topic"}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 text-stone-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-30 mt-2 w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg shadow-stone-200/60">
          <div className="max-h-72 overflow-y-auto py-1.5" id={listboxId} role="listbox">
            {topics.map((topic, index) => {
              const isActive = activeIndex === index;
              const isSelected = topic === value;

              return (
                <button
                  aria-selected={isSelected}
                  className={`grid w-full grid-cols-[1fr_auto] items-center gap-3 px-3 py-2.5 text-left text-sm transition ${
                    isSelected
                      ? "bg-slate-50 text-slate-800"
                      : isActive
                        ? "bg-stone-50 text-stone-950"
                        : "text-stone-700 hover:bg-stone-50 hover:text-stone-950"
                  }`}
                  id={`${listboxId}-${index}`}
                  key={topic}
                  onClick={() => selectTopic(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  role="option"
                  tabIndex={-1}
                  type="button"
                >
                  <span className="font-medium">{topic}</span>
                  {isSelected ? (
                    <Check aria-hidden="true" className="h-4 w-4 text-slate-700" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileScriptFailed, setTurnstileScriptFailed] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const isTurnstileConfigured = turnstileSiteKey.trim().length > 0;
  const isTurnstileUnavailable = !isTurnstileConfigured || turnstileScriptFailed;

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function resetTurnstile() {
    window.turnstile?.reset();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before sending your message."
      });
      return;
    }

    if (isTurnstileUnavailable) {
      setStatus({
        type: "error",
        message: getTurnstileUnavailableMessage(isTurnstileConfigured)
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const turnstileToken = formData.get("cf-turnstile-response");

    if (typeof turnstileToken !== "string" || !turnstileToken) {
      setStatus({
        type: "error",
        message:
          "Complete the verification before sending your message. If it does not load, please refresh or email directly."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          "cf-turnstile-response": turnstileToken
        })
      });

      const data = (await response.json()) as {
        ok?: boolean;
        sent?: boolean;
        message?: string;
        errors?: FieldErrors;
      };

      if (!response.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setStatus({
          type: "error",
          message:
            data.message ||
            "Something went wrong while sending your message. Please try again or email directly."
        });
        resetTurnstile();
        return;
      }

      if (data.sent === false) {
        setForm(initialFormState);
        setErrors({});
        setStatus(null);
        resetTurnstile();
        return;
      }

      setForm(initialFormState);
      setErrors({});
      setStatus({
        type: "success",
        message: "Thanks — your message was sent."
      });
      resetTurnstile();
    } catch {
      setStatus({
        type: "error",
        message:
          "The message could not be sent right now. Please try again or email accttoolslab@gmail.com."
      });
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isTurnstileConfigured ? (
        <Script
          onError={() => setTurnstileScriptFailed(true)}
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}
      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={form.companyWebsite}
          onChange={(event) => updateField("companyWebsite", event.target.value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          error={errors.name}
          id="name"
          label="Name"
        >
          <input
            className={inputClassName}
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
          />
        </FormField>

        <FormField
          error={errors.email}
          id="email"
          label="Email"
        >
          <input
            className={inputClassName}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={120}
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
          />
        </FormField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField error={errors.topic} id="topic" label="Topic / reason">
          <TopicSelect
            error={errors.topic}
            id="topic"
            value={form.topic}
            onChange={(topic) => updateField("topic", topic)}
          />
        </FormField>

        <FormField error={errors.pageUrl} id="pageUrl" label="Page or tool URL">
          <input
            className={inputClassName}
            id="pageUrl"
            name="pageUrl"
            type="text"
            inputMode="url"
            maxLength={300}
            placeholder="Optional"
            value={form.pageUrl}
            onChange={(event) => updateField("pageUrl", event.target.value)}
            aria-describedby={errors.pageUrl ? "pageUrl-error" : undefined}
            aria-invalid={Boolean(errors.pageUrl)}
          />
        </FormField>
      </div>

      <FormField error={errors.subject} id="subject" label="Subject">
        <input
          className={inputClassName}
          id="subject"
          name="subject"
          type="text"
          maxLength={120}
          value={form.subject}
          onChange={(event) => updateField("subject", event.target.value)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          aria-invalid={Boolean(errors.subject)}
        />
      </FormField>

      <FormField error={errors.message} id="message" label="Message">
        <textarea
          className={`${inputClassName} min-h-40 resize-y py-3`}
          id="message"
          name="message"
          maxLength={3000}
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={Boolean(errors.message)}
        />
      </FormField>

      {status ? (
        <div
          className={`rounded-xl border p-4 text-sm leading-6 ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
          role="status"
        >
          {status.message}
        </div>
      ) : null}

      {isTurnstileUnavailable ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
          role="status"
        >
          {getTurnstileUnavailableMessage(isTurnstileConfigured)}
        </div>
      ) : (
        <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
      )}

      <button
        className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-slate-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
        type="submit"
        disabled={isSubmitting || isTurnstileUnavailable}
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
      </form>
    </>
  );
}

const inputClassName =
  "h-12 w-full rounded-md border border-dashed border-stone-300 bg-stone-50 px-4 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 hover:border-solid hover:border-stone-300 hover:bg-stone-50 focus:border-solid focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100";

function getTurnstileUnavailableMessage(isConfigured: boolean): string {
  if (process.env.NODE_ENV === "development" && !isConfigured) {
    return "Contact verification is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in .env.local.";
  }

  if (!isConfigured) {
    return "Contact verification is unavailable. Please email accttoolslab@gmail.com directly.";
  }

  return "Contact verification could not load. Please refresh the page or email accttoolslab@gmail.com directly.";
}

function FormField({
  children,
  error,
  id,
  label
}: {
  children: ReactNode;
  error?: string;
  id: string;
  label: string;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-semibold text-stone-800" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-rose-700" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
