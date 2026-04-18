import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { logger } from "@/lib/logger";
import {
  InvalidTokenError,
  resetPassword,
  TokenExpiredError,
} from "@/lib/services/auth.service";
import { ResetPasswordSchema } from "@/lib/validators/user";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  try {
    await applyRateLimit(`reset-password:${ip}`, {
      name: "reset-password",
      points: 5,
      duration: 3600,
    });

    const { token, password, confirmPassword } = await request.json();

    const validatedData = ResetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validatedData.success) {
      return Response.json(
        {
          success: false,
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: validatedData.error.issues,
        },
        { status: 400 },
      );
    }

    if (!token) {
      return Response.json(
        {
          success: false,
          error: "Token is required",
          code: "MISSING_TOKEN",
        },
        { status: 400 },
      );
    }

    await resetPassword(token, password);

    logger.info("Password reset successfully", {
      route: "/api/auth/reset-password",
    });

    return Response.json({
      success: true,
      message: "Password has been reset successfully.",
    });
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
        },
      );
    }

    if (error instanceof TokenExpiredError) {
      return Response.json(
        {
          success: false,
          error: "The reset link has expired.",
          code: "TOKEN_EXPIRED",
        },
        { status: 400 },
      );
    }

    if (error instanceof InvalidTokenError) {
      return Response.json(
        {
          success: false,
          error: "The reset link is invalid.",
          code: "INVALID_TOKEN",
        },
        { status: 400 },
      );
    }

    logger.error("Reset password route error", {
      route: "/api/auth/reset-password",
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
