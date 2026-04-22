import * as invoiceRepo from "@/lib/db/repositories/invoice.repo";
import type { InvoiceRecord } from "@/lib/db/repositories/types";
import { InvoiceNumberTakenError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import {
  InvoiceCreateSchema,
  type InvoiceFiltersInput,
} from "@/lib/validators/invoice";
import * as z from "zod";
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

export async function getNextInvoiceNumber(userId: string): Promise<string> {
  try {
    return await invoiceRepo.getNextNumber(userId);
  } catch (error) {
    logger.error("Failed to get next invoice number", { userId, error });

    throw error;
  }
}

export async function checkInvoiceNumberExists(
  userId: string,
  invoiceNumber: string,
): Promise<boolean> {
  try {
    return await invoiceRepo.checkNumberExists(userId, invoiceNumber.trim());
  } catch (error) {
    logger.error("Failed to check invoice number", { userId, error });

    throw error;
  }
}

export async function createInvoice(
  userId: string,
  data: z.infer<typeof InvoiceCreateSchema>,
  options?: AuditContext,
): Promise<InvoiceRecord> {
  try {
    const exists = await invoiceRepo.checkNumberExists(
      userId,
      data.invoiceNumber.trim(),
    );

    if (exists) {
      throw new InvoiceNumberTakenError();
    }

    const {
      taxRate,
      taxAmount,
      discountValue,
      discountAmount,
      subtotal,
      total,
      ...rest
    } = data;

    const invoice = await invoiceRepo.create({
      ...rest,
      userId,
      status: "draft",
      issueDate: new Date(data.issueDate),
      dueDate: new Date(data.dueDate),
      lineItems: data.lineItems,
      taxRate: taxRate.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountValue: discountValue.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
    });

    await logAudit("invoice_created", {
      userId,
      entityType: "invoice",
      entityId: invoice.id,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      metadata: { invoiceNumber: invoice.invoiceNumber },
    });

    logger.info("Invoice created", {
      userId,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
    });

    return invoice;
  } catch (error) {
    logger.error("Failed to create invoice", { userId, data, error });

    throw error;
  }
}
