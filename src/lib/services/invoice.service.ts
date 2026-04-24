import type { ClientSuggestion } from "@/lib/db/repositories/invoice.repo";
import * as invoiceRepo from "@/lib/db/repositories/invoice.repo";
import type { InvoiceRecord, NewInvoice } from "@/lib/db/repositories/types";
import { InvoiceNumberTakenError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { sendInvoiceEmail } from "@/lib/mail";
import { ValidationError } from "@/lib/middleware/validate";
import {
  InvoiceCreateSchema,
  InvoiceUpdateSchema,
  type InvoiceFiltersInput,
} from "@/lib/validators/invoice";
import * as z from "zod";
import { logAudit } from "./audit.service";
import { generateInvoicePdf } from "./pdf.service";
import { getSettings } from "./settings.service";

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

    result.items = result.items.filter(Boolean);

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

export type { ClientSuggestion };

export async function getClientSuggestions(
  userId: string,
  query: string,
): Promise<ClientSuggestion[]> {
  try {
    return await invoiceRepo.getClientSuggestions(userId, query.trim());
  } catch (error) {
    logger.error("Failed to get client suggestions", { userId, query, error });

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
      id: _unusedId,
      taxRate,
      taxAmount,
      discountValue,
      discountAmount,
      subtotal,
      total,
      fromPan,
      ...rest
    } = data;

    void _unusedId;

    const invoice = await invoiceRepo.create({
      ...rest,
      fromPan: fromPan ?? undefined,
      userId,
      status: data.status || "draft",
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
    logger.error("Failed to create invoice", { userId, error });

    throw error;
  }
}

export async function updateInvoice(
  id: string,
  userId: string,
  data: z.infer<typeof InvoiceUpdateSchema>,
  options?: AuditContext,
): Promise<InvoiceRecord | undefined> {
  try {
    const current = await invoiceRepo.findInvoiceById(id, userId);
    if (!current) return undefined;

    if (data.invoiceNumber) {
      const exists = await invoiceRepo.checkNumberExists(
        userId,
        data.invoiceNumber.trim(),
      );

      if (exists && current.invoiceNumber !== data.invoiceNumber.trim()) {
        throw new InvoiceNumberTakenError();
      }
    }

    if (data.issueDate || data.dueDate) {
      const newIssueDate = data.issueDate
        ? new Date(data.issueDate)
        : new Date(current.issueDate);
      const newDueDate = data.dueDate
        ? new Date(data.dueDate)
        : new Date(current.dueDate);

      if (newDueDate < newIssueDate) {
        throw new ValidationError([
          { field: "dueDate", message: "Due date cannot be before issue date" },
        ]);
      }
    }

    const normalizedData = { ...data } as Record<string, unknown>;

    if (data.taxRate !== undefined)
      normalizedData.taxRate = data.taxRate.toFixed(2);
    if (data.taxAmount !== undefined)
      normalizedData.taxAmount = data.taxAmount.toFixed(2);
    if (data.discountValue !== undefined)
      normalizedData.discountValue = data.discountValue.toFixed(2);
    if (data.discountAmount !== undefined)
      normalizedData.discountAmount = data.discountAmount.toFixed(2);
    if (data.subtotal !== undefined)
      normalizedData.subtotal = data.subtotal.toFixed(2);
    if (data.total !== undefined) normalizedData.total = data.total.toFixed(2);

    if (data.issueDate) normalizedData.issueDate = new Date(data.issueDate);
    if (data.dueDate) normalizedData.dueDate = new Date(data.dueDate);

    delete normalizedData.id;
    delete normalizedData.userId;

    const invoice = await invoiceRepo.update(
      id,
      userId,
      normalizedData as Partial<NewInvoice>,
    );

    if (invoice) {
      await logAudit("invoice_updated", {
        userId,
        entityType: "invoice",
        entityId: id,
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
        metadata: { updates: Object.keys(data) },
      });

      logger.info("Invoice updated", { userId, invoiceId: id });
    }

    return invoice;
  } catch (error) {
    logger.error("Failed to update invoice", { id, userId, error });

    throw error;
  }
}

export async function deleteInvoice(
  id: string,
  userId: string,
  options?: AuditContext,
): Promise<void> {
  try {
    await invoiceRepo.deleteInvoice(id, userId);

    await logAudit("invoice_deleted", {
      userId,
      entityType: "invoice",
      entityId: id,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    });

    logger.info("Invoice deleted", { userId, invoiceId: id });
  } catch (error) {
    logger.error("Failed to delete invoice", { id, userId, error });

    throw error;
  }
}

export async function sendInvoice(
  id: string,
  userId: string,
  data: {
    toEmail: string;
    subject?: string;
    message?: string;
    attachPdf: boolean;
  },
  options?: AuditContext,
): Promise<InvoiceRecord> {
  try {
    const invoice = await invoiceRepo.findInvoiceById(id, userId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const settings = await getSettings(userId);

    const businessName =
      invoice.fromName ||
      settings?.businessName ||
      "SoftwareCrafting Tools User";

    let pdfBuffer: Buffer | undefined;

    if (data.attachPdf) {
      pdfBuffer = Buffer.from(await generateInvoicePdf(invoice));
    }

    const result = await sendInvoiceEmail({
      email: data.toEmail,
      businessName,
      invoiceNumber: invoice.invoiceNumber,
      amount: `${invoice.currency} ${invoice.total}`,
      message: data.message,
      pdfBuffer: pdfBuffer || Buffer.alloc(0),
      userId,
      invoiceId: id,
    });

    if (result.error) {
      throw result.error;
    }

    const updatedInvoice = await invoiceRepo.update(id, userId, {
      status: "sent",
      sentAt: new Date(),
    });

    if (!updatedInvoice) {
      throw new Error("Failed to update invoice status");
    }

    await logAudit("invoice_sent", {
      userId,
      entityType: "invoice",
      entityId: id,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      metadata: { toEmail: data.toEmail, invoiceNumber: invoice.invoiceNumber },
    });

    logger.info("Invoice sent", {
      userId,
      invoiceId: id,
      toEmail: data.toEmail,
    });

    return updatedInvoice;
  } catch (error) {
    logger.error("Failed to send invoice", { id, userId, error, data });

    throw error;
  }
}
