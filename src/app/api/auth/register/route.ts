import type { NextRequest } from "next/server";
import { register, EmailAlreadyExistsError } from "@/lib/services/auth.service";
import { parseBody, ValidationError } from "@/lib/middleware/validate";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { RegisterSchema } from "@/lib/validators/user";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  try {
    await applyRateLimit(`register:${ip}`, {
      name: "register",
      points: process.env.NODE_ENV === "development" ? 50 : 5,
      duration: 3600,
    });

    const userAgent = request.headers.get("user-agent") ?? undefined;
    const body = await parseBody(request, RegisterSchema);

    const { user } = await register({
      ...body,
      ipAddress: ip,
      userAgent,
    });

    logger.info("User registered", { userId: user.id, route: "/api/auth/register" });

    return Response.json({ success: true, data: { user } }, { status: 201 });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return Response.json(
        {
          success: false,
          error: "Too many requests. Try again later.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: { "Retry-After": String(error.retryAfter) },
        }
      );
    }

    if (error instanceof ValidationError) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.details,
        },
        { status: 400 }
      );
    }

    if (error instanceof EmailAlreadyExistsError) {
      logger.warn("Duplicate registration attempt", {
        route: "/api/auth/register",
      });
      return Response.json(
        {
          success: false,
          error: error.message,
          code: "EMAIL_ALREADY_EXISTS",
        },
        { status: 409 }
      );
    }

    logger.error("Register route error", {
      route: "/api/auth/register",
      error,
    });
    return Response.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}
