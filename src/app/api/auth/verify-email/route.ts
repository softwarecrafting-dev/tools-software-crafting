import { logger } from "@/lib/logger";
import { parseBody, ValidationError } from "@/lib/middleware/validate";
import {
  InvalidTokenError,
  TokenExpiredError,
  UserAlreadyVerifiedError,
  verifyEmail,
} from "@/lib/services/verify.service";
import type { NextRequest } from "next/server";
import { z } from "zod";

const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required").max(255, "Token is too long"),
});

export async function POST(request: NextRequest) {
  try {
    const { token } = await parseBody(request, VerifyEmailSchema);

    await verifyEmail(token);

    return Response.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        {
          success: false,
          code: "VALIDATION_ERROR",
          error: "Invalid request payload",
        },
        { status: 400 },
      );
    }

    if (error instanceof InvalidTokenError) {
      return Response.json(
        { success: false, code: "INVALID_TOKEN", error: error.message },
        { status: 400 },
      );
    }

    if (error instanceof TokenExpiredError) {
      return Response.json(
        { success: false, code: "TOKEN_EXPIRED", error: error.message },
        { status: 400 },
      );
    }

    if (error instanceof UserAlreadyVerifiedError) {
      return Response.json({
        success: true,
        code: "ALREADY_VERIFIED",
        message: error.message,
      });
    }

    logger.error("Verify email error", {
      error,
      route: "/api/auth/verify-email",
    });
    return Response.json(
      { success: false, code: "INTERNAL_ERROR", error: "Something went wrong" },
      { status: 500 },
    );
  }
}
