import type { InvoiceRecord } from "@/lib/db/repositories/types";
import { logger } from "@/lib/logger";
import { renderInvoiceToBuffer } from "../pdf/render";

export async function generateInvoicePdf(
  invoice: InvoiceRecord,
): Promise<Buffer> {
  try {
    const buffer = await renderInvoiceToBuffer(invoice);

    logger.info("PDF generated successfully", {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      size: buffer.length,
    });

    return buffer;
  } catch (error) {
    logger.error("Failed to generate PDF", {
      invoiceId: invoice.id,
      error,
    });

    throw new Error("Failed to generate PDF");
  }
}
