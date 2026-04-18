import { logger } from "@/lib/logger";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseBody, ValidationError } from "@/lib/middleware/validate";
import { resendVerification } from "@/lib/services/auth.service";
import { ForgotPasswordSchema } from "@/lib/validators/user";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    await applyRateLimit(`resend-verification:${ip}`, {
      name: "resend-verification",
      points: 3,
      duration: 3600, // 3 attempts per hour
    });

    const body = await parseBody(request, ForgotPasswordSchema);

    await resendVerification(body.email, { ipAddress: ip, userAgent });

    logger.info("Resend verification request handled", {
      email: body.email,
      ip,
    });

    return Response.json({
      success: true,
      message: "If an account exists with that email, a new verification link has been sent.",
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return Response.json(
        {
          success: false,
          error: "Too many requests. Please try again later.",
          code: "RATE_LIMITED",
          retryAfter: error.retryAfter,
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

    logger.error("Resend verification route error", { error, ip });
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
