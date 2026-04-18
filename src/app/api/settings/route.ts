import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseBody, ValidationError } from "@/lib/middleware/validate";
import { getSettings, updateSettings } from "@/lib/services/settings.service";
import { SettingsSchema } from "@/lib/validators/settings";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const session = await requireAuth();
    const settings = await getSettings(session.userId);

    return Response.json({ success: true, data: settings ?? null });
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

    logger.error("GET /api/settings error", { error });

    return Response.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const userAgent = request.headers.get("user-agent") ?? undefined;

    await applyRateLimit(`settings_update:${session.userId}`, {
      name: "settings_update",
      points: 10,
      duration: 60,
    });

    const data = await parseBody(request, SettingsSchema.partial());
    const settings = await updateSettings(session.userId, data, {
      ipAddress,
      userAgent,
    });

    return Response.json({ success: true, data: settings });
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

    if (error instanceof ValidationError) {
      return Response.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          error: "Invalid settings format",
          details: error.details,
        },
        { status: 400 },
      );
    }

    logger.error("PATCH /api/settings error", { error });

    return Response.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 },
    );
  }
}
