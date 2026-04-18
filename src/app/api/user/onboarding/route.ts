import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { completeOnboarding } from "@/lib/services/settings.service";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const userAgent = request.headers.get("user-agent") ?? undefined;

    await applyRateLimit(`onboarding_complete:${session.userId}`, {
      name: "onboarding_complete",
      points: 10,
      duration: 60,
    });

    await completeOnboarding(session.userId, {
      ipAddress,
      userAgent,
    });

    return Response.json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (error instanceof ForbiddenError) {
      return Response.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
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

    logger.error("PATCH /api/user/onboarding error", { error });

    return Response.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 },
    );
  }
}
