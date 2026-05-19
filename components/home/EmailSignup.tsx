"use client";

import { useState } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextEmail = email.trim();

    if (!EMAIL_PATTERN.test(nextEmail)) {
      setError("Please enter a valid email address.");
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    setError("");
    setEmail("");
  }

  return (
    <div className="mx-auto w-full max-w-xl text-center">
      <p className="text-base font-medium leading-7 text-stone-700 sm:text-lg">
        Stay updated with new accounting tools and related guides.
      </p>

      <form
        action="#"
        className="mx-auto mt-6 flex max-w-[30rem] flex-col items-center gap-3 sm:flex-row sm:items-stretch"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="email-signup-input">
          Enter your email
        </label>
        <input
          autoComplete="email"
          className="h-12 w-full rounded-full border border-stone-200 bg-white/96 px-5 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-300 focus:ring-4 focus:ring-stone-200"
          id="email-signup-input"
          inputMode="email"
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) {
              setError("");
            }
          }}
          placeholder="Enter your email"
          type="email"
          value={email}
        />
        <button
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-stone-950 bg-stone-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300"
          type="submit"
        >
          Notify me
        </button>
      </form>

      <div aria-live="polite" className="mt-3 min-h-[1.5rem] text-sm">
        {submitted ? <p className="font-medium text-emerald-700">Thanks - we&apos;ll keep you updated.</p> : null}
        {!submitted && error ? <p className="font-medium text-rose-600">{error}</p> : null}
      </div>
    </div>
  );
}
