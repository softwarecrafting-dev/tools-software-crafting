import { getSession } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { parseBody, ValidationError } from "@/lib/middleware/validate";
import { login, InvalidCredentialsError } from "@/lib/services/auth.service";
import { LoginSchema } from "@/lib/validators/user";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await parseBody(request, LoginSchema);

    const ipAddress = request.headers.get("x-forwarded-for") ?? undefined;
    const userAgent = request.headers.get("user-agent") ?? undefined;

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
        { success: false, code: "VALIDATION_ERROR", error: "Invalid credentials format" },
        { status: 400 }
      );
    }

    if (error instanceof InvalidCredentialsError) {
      return Response.json(
        { success: false, code: "INVALID_CREDENTIALS", error: error.message },
        { status: 401 }
      );
    }

    logger.error("Login route error", { error });
    return Response.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 }
    );
  }
}
