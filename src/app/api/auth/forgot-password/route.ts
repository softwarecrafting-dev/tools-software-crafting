import { logger } from "@/lib/logger";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseBody, ValidationError } from "@/lib/middleware/validate";
import { forgotPassword } from "@/lib/services/auth.service";
import { ForgotPasswordSchema } from "@/lib/validators/user";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  try {
    await applyRateLimit(`forgot-password:${ip}`, {
      name: "forgot-password",
      points: 5,
      duration: 600, // 5 requests per 10 minutes
    });

    const body = await parseBody(request, ForgotPasswordSchema);

    await forgotPassword(body.email);

    logger.info("Forgot password requested", {
      email: body.email,
      route: "/api/auth/forgot-password",
    });

    return Response.json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return Response.json(
        {
          success: false,
          error: "Too many requests. Please wait before trying again.",
          code: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: { "Retry-After": String(error.retryAfter) },
        },
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
        { status: 400 },
      );
    }

    logger.error("Forgot password route error", {
      route: "/api/auth/forgot-password",
      error,
    });

    return Response.json(
      {
        success: false,
        error: "Something went wrong. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
