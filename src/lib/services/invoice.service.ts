import * as invoiceRepo from "@/lib/db/repositories/invoice.repo";
import type { InvoiceRecord } from "@/lib/db/repositories/types";
import { logger } from "@/lib/logger";
import type { InvoiceFiltersInput } from "@/lib/validators/invoice";
import { logAudit } from "./audit.service";

interface AuditContext {
  ipAddress?: string;
  userAgent?: string;
}

export async function getInvoices(
  userId: string,
  filters: InvoiceFiltersInput,
  options?: AuditContext,
): Promise<{ items: InvoiceRecord[]; nextCursor: string | null }> {
  try {
    const result = await invoiceRepo.findAllInvoices(userId, filters);

    await logAudit("invoice_list_viewed", {
      userId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      metadata: { filters, count: result.items.length },
    });

    logger.info("Invoices fetched", {
      userId,
      count: result.items.length,
      filters,
    });

    return result;
  } catch (error) {
    logger.error("Failed to fetch invoices", { userId, error, filters });

    throw error;
  }
}

export async function getInvoice(
  id: string,
  userId: string,
  options?: AuditContext,
): Promise<InvoiceRecord | undefined> {
  try {
    const invoice = await invoiceRepo.findInvoiceById(id, userId);

    if (invoice) {
      await logAudit("invoice_viewed", {
        userId,
        entityType: "invoice",
        entityId: id,
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
      });
    }

    return invoice;
  } catch (error) {
    logger.error("Failed to fetch invoice", { id, userId, error });
    throw error;
  }
}
