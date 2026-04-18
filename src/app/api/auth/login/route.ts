import { getSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseBody, ValidationError } from "@/lib/middleware/validate";
import { InvalidCredentialsError, login } from "@/lib/services/auth.service";
import { LoginSchema } from "@/lib/validators/user";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await parseBody(request, LoginSchema);

    const ipAddress = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const userAgent = request.headers.get("user-agent") ?? undefined;

    await applyRateLimit(ipAddress, {
      name: "auth_login",
      points: 5,
      duration: 60,
    });

    const { user, sessionToken } = await login({
      ...data,
      ipAddress,
      userAgent,
    });

    const session = await getSession();
    session.userId = user.id;
    session.role = user.role as "admin" | "member";
    session.sessionId = sessionToken;
    session.expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    await session.save();

    return Response.json({ success: true, user });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          error: "Invalid credentials format",
        },
        { status: 400 },
      );
    }

    if (error instanceof RateLimitError) {
      return Response.json(
        {
          success: false,
          code: "TOO_MANY_REQUESTS",
          error: `Too many attempts. Please try again in ${error.retryAfter}s`,
        },
        {
          status: 429,
          headers: { "Retry-After": error.retryAfter.toString() },
        },
      );
    }

    if (error instanceof InvalidCredentialsError) {
      return Response.json(
        { success: false, code: "INVALID_CREDENTIALS", error: error.message },
        { status: 401 },
      );
    }

    logger.error("Login route error", { error });
    return Response.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 },
    );
  }
}
