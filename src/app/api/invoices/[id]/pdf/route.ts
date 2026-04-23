import { logger } from "@/lib/logger";
import { AuthError, ForbiddenError, requireAuth } from "@/lib/middleware/auth";
import { applyRateLimit, RateLimitError } from "@/lib/middleware/rate-limit";
import { parseParams, ValidationError } from "@/lib/middleware/validate";
import { logAudit } from "@/lib/services/audit.service";
import { getInvoice } from "@/lib/services/invoice.service";
import { generateInvoicePdf } from "@/lib/services/pdf.service";
import { IdParamSchema } from "@/lib/validators/common";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    const { userId } = await requireAuth();

    const { id } = await parseParams(params, IdParamSchema);

    await applyRateLimit(`invoice:pdf:${userId}:${id}`, {
      name: "invoice_pdf_download",
      points: 10,
      duration: 60,
    });

    const invoice = await getInvoice(id, userId, { ipAddress: ip, userAgent });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const pdfBuffer = await generateInvoicePdf(invoice);

    await logAudit("invoice_pdf_downloaded", {
      userId,
      entityType: "invoice",
      entityId: id,
      ipAddress: ip,
      userAgent,
      metadata: { invoiceNumber: invoice.invoiceNumber },
    });

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error: unknown) {
    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { success: false, error: "Too many requests", code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(error.retryAfter) } },
      );
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.details,
        },
        { status: 400 },
      );
    }

    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        { success: false, error: "Forbidden", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    logger.error("Invoice PDF download error", { error });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate PDF",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}
