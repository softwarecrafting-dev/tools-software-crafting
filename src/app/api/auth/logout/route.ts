import { getSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { logout } from "@/lib/services/auth.service";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const sessionId = session.sessionId;

    if (sessionId) {
      const ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "unknown";
      const userAgent = request.headers.get("user-agent") ?? undefined;

      await applyRateLimit(ipAddress, {
        name: "auth_logout",
        points: 10,
        duration: 60,
      });

      await logout(sessionId, {
        userId: session.userId,
        ipAddress,
        userAgent,
      });
    }

    session.destroy();

    return new Response(null, { status: 204 });
  } catch (error) {
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

    logger.error("Logout route error", { error });

    return Response.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 },
    );
  }
}
