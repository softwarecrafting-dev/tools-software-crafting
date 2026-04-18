import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

const limiters = new Map<string, RateLimiterMemory>();

function getLimiter(name: string, points: number, duration: number) {
  if (!limiters.has(name)) {
    limiters.set(
      name,
      new RateLimiterMemory({ keyPrefix: name, points, duration }),
    );
  }

  return limiters.get(name)!;
}

export class RateLimitError extends Error {
  retryAfter: number;

  constructor(retryAfter: number) {
    super("Too many requests");
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export async function applyRateLimit(
  key: string,
  opts: { name: string; points: number; duration: number },
): Promise<void> {
  const limiter = getLimiter(opts.name, opts.points, opts.duration);

  try {
    await limiter.consume(key);
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      throw new RateLimitError(Math.ceil(error.msBeforeNext / 1000));
    }

    throw error;
  }
}
