import { db } from "@/lib/db/client";
import { rateLimits } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";

/**
 * Custom Drizzle-based rate limiter to avoid the library's internal dynamic import bug
 * which causes "drizzle-orm is not installed" errors in Next.js/Turbopack.
 */
class CustomDbRateLimiter {
  private name: string;
  private points: number;
  private duration: number;

  constructor(opts: { name: string; points: number; duration: number }) {
    this.name = opts.name;
    this.points = opts.points;
    this.duration = opts.duration;
  }

  async consume(key: string): Promise<RateLimiterRes> {
    const rlKey = `${this.name}:${key}`;
    const now = new Date();
    const durationMs = this.duration * 1000;
    const expireAt = new Date(now.getTime() + durationMs);

    const [result] = await db
      .insert(rateLimits)
      .values({
        key: rlKey,
        points: 1,
        expire: expireAt,
      })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          points: sql`${rateLimits.points} + 1`,
          expire: sql`CASE WHEN ${rateLimits.expire} <= ${now.toISOString()} THEN ${expireAt.toISOString()} ELSE ${rateLimits.expire} END`,
        },
      })
      .returning();

    const res = new RateLimiterRes();
    // Use type assertion to bypass read-only properties in TypeScript definitions
    // which incorrectly mark these as immutable even though the library populates them.
    const mutableRes = res as unknown as {
      consumedPoints: number;
      remainingPoints: number;
      msBeforeNext: number;
      isFirstInDuration: boolean;
    };

    mutableRes.consumedPoints = result.points;
    mutableRes.remainingPoints = Math.max(this.points - result.points, 0);
    mutableRes.msBeforeNext = result.expire
      ? Math.max(result.expire.getTime() - now.getTime(), 0)
      : -1;
    mutableRes.isFirstInDuration = result.points === 1;

    if (res.consumedPoints > this.points) {
      throw res;
    }

    return res;
  }
}

const postgresLimiters = new Map<string, CustomDbRateLimiter>();
const memoryLimiters = new Map<string, RateLimiterMemory>();

function getPostgresLimiter(name: string, points: number, duration: number) {
  if (!postgresLimiters.has(name)) {
    postgresLimiters.set(name, new CustomDbRateLimiter({ name, points, duration }));
  }
  return postgresLimiters.get(name)!;
}

function getMemoryLimiter(name: string, points: number, duration: number) {
  if (!memoryLimiters.has(name)) {
    memoryLimiters.set(
      name,
      new RateLimiterMemory({ keyPrefix: name, points, duration }),
    );
  }

  return memoryLimiters.get(name)!;
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
  const pgLimiter = getPostgresLimiter(opts.name, opts.points, opts.duration);

  try {
    await pgLimiter.consume(key);
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      throw new RateLimitError(Math.ceil(error.msBeforeNext / 1000));
    }

    // Fallback to memory if database fails
    console.error("Rate limit database error, falling back to memory:", error);
    const memLimiter = getMemoryLimiter(opts.name, opts.points, opts.duration);
    try {
      await memLimiter.consume(key);
    } catch (memError) {
      if (memError instanceof RateLimiterRes) {
        throw new RateLimitError(Math.ceil(memError.msBeforeNext / 1000));
      }
      throw memError;
    }
  }
}
