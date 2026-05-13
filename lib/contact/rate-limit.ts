export type RateLimitIncrement = {
  count: number;
  resetAt: number;
};

export type RateLimitResult = {
  limited: boolean;
  remaining: number;
  resetAt: number;
};

export type RateLimitStore = {
  /**
   * Atomically increment the key for the current window and return the count.
   * Production implementations can back this with Redis, Vercel KV, or another
   * shared store using an atomic increment plus expiry.
   */
  increment: (key: string, windowMs: number, now: number) => Promise<RateLimitIncrement>;
};

export type SharedRateLimitIncrementer = (params: {
  key: string;
  now: number;
  windowMs: number;
}) => Promise<RateLimitIncrement>;

type MemoryRateLimitEntry = {
  count: number;
  resetAt: number;
};

export class MemoryRateLimitStore implements RateLimitStore {
  private readonly entries = new Map<string, MemoryRateLimitEntry>();

  async increment(key: string, windowMs: number, now: number): Promise<RateLimitIncrement> {
    this.cleanup(now);

    const currentEntry = this.entries.get(key);

    if (!currentEntry || currentEntry.resetAt <= now) {
      const nextEntry = {
        count: 1,
        resetAt: now + windowMs
      };
      this.entries.set(key, nextEntry);
      return nextEntry;
    }

    currentEntry.count += 1;
    return currentEntry;
  }

  private cleanup(now: number) {
    for (const [key, entry] of this.entries.entries()) {
      if (entry.resetAt <= now) {
        this.entries.delete(key);
      }
    }
  }
}

/**
 * Thin adapter for production stores such as Redis, Vercel KV, or Upstash.
 * The incrementer must perform an atomic increment and set/keep an expiry for
 * the current window so limits work across serverless instances.
 */
export class SharedRateLimitStore implements RateLimitStore {
  constructor(private readonly incrementer: SharedRateLimitIncrementer) {}

  increment(key: string, windowMs: number, now: number): Promise<RateLimitIncrement> {
    return this.incrementer({ key, now, windowMs });
  }
}

export async function checkRateLimit({
  key,
  maxRequests,
  now = Date.now(),
  store,
  windowMs
}: {
  key: string;
  maxRequests: number;
  now?: number;
  store: RateLimitStore;
  windowMs: number;
}): Promise<RateLimitResult> {
  const entry = await store.increment(key, windowMs, now);
  const remaining = Math.max(0, maxRequests - entry.count);

  return {
    limited: entry.count > maxRequests,
    remaining,
    resetAt: entry.resetAt
  };
}
