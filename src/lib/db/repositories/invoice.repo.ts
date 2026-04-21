import { db } from "@/lib/db/client";
import { invoices, userSettings } from "@/lib/db/schema";
import type { InvoiceFiltersInput } from "@/lib/validators/invoice";
import type { SQL } from "drizzle-orm";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  ilike,
  isNull,
  lt,
  lte,
  or,
} from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import type { InvoiceRecord, NewInvoice } from "./types";

export const DEFAULT_LIMIT = 25;

export async function create(data: NewInvoice): Promise<InvoiceRecord> {
  const [invoice] = await db.insert(invoices).values(data).returning();

  return invoice;
}

export async function checkNumberExists(
  userId: string,
  invoiceNumber: string,
): Promise<boolean> {
  const [existing] = await db
    .select({ id: invoices.id })
    .from(invoices)
    .where(
      and(
        eq(invoices.userId, userId),
        eq(invoices.invoiceNumber, invoiceNumber),
      ),
    )
    .limit(1);

  return !!existing;
}

export async function getNextNumber(userId: string): Promise<string> {
  const [settings] = await db
    .select({ invoicePrefix: userSettings.invoicePrefix })
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  const prefix = settings?.invoicePrefix ?? "INV";

  const [lastInvoice] = await db
    .select({ invoiceNumber: invoices.invoiceNumber })
    .from(invoices)
    .where(eq(invoices.userId, userId))
    .orderBy(desc(invoices.createdAt))
    .limit(1);

  if (!lastInvoice) {
    return `${prefix}-0001`;
  }

  const match = lastInvoice.invoiceNumber.match(/\d+$/);
  if (!match) {
    return `${prefix}-0001`;
  }

  const lastNumber = parseInt(match[0], 10);
  const nextNumber = (lastNumber + 1).toString().padStart(match[0].length, "0");

  const prefixPart = lastInvoice.invoiceNumber.substring(
    0,
    lastInvoice.invoiceNumber.length - match[0].length,
  );

  return `${prefixPart}${nextNumber}`;
}

export async function findInvoiceById(
  id: string,
  userId: string,
): Promise<InvoiceRecord | undefined> {
  const [invoice] = await db
    .select()
    .from(invoices)
    .where(
      and(
        eq(invoices.id, id),
        eq(invoices.userId, userId),
        isNull(invoices.deletedAt),
      ),
    )
    .limit(1);

  return invoice;
}

export async function findAllInvoices(
  userId: string,
  filters: InvoiceFiltersInput,
): Promise<{ items: InvoiceRecord[]; nextCursor: string | null }> {
  const {
    limit = DEFAULT_LIMIT,
    status,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    fromDate,
    toDate,
    cursor,
  } = filters;

  const whereConditions: (SQL | undefined)[] = [
    eq(invoices.userId, userId),
    isNull(invoices.deletedAt),
  ];

  if (status) {
    whereConditions.push(eq(invoices.status, status));
  }

  if (search) {
    const cleanSearch = search.trim();

    whereConditions.push(
      or(
        ilike(invoices.clientName, `%${cleanSearch}%`),
        ilike(invoices.invoiceNumber, `%${cleanSearch}%`),
      ),
    );
  }

  const now = new Date();
  const twoYearsAgo = new Date(
    now.getFullYear() - 2,
    now.getMonth(),
    now.getDate(),
  );

  if (fromDate) {
    const start = new Date(fromDate);
    const effectiveStart = start < twoYearsAgo ? twoYearsAgo : start;

    whereConditions.push(gte(invoices.issueDate, effectiveStart));
  } else {
    whereConditions.push(gte(invoices.issueDate, twoYearsAgo));
  }

  if (toDate) {
    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    whereConditions.push(lte(invoices.issueDate, end));
  }

  const sortColumnMapping: Record<string, PgColumn> = {
    invoiceNumber: invoices.invoiceNumber,
    clientName: invoices.clientName,
    status: invoices.status,
    issueDate: invoices.issueDate,
    dueDate: invoices.dueDate,
    total: invoices.total,
    createdAt: invoices.createdAt,
    updatedAt: invoices.updatedAt,
  };

  if (cursor) {
    const cursorInvoice = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, cursor), eq(invoices.userId, userId)))
      .limit(1)
      .then((res) => res[0]);

    if (cursorInvoice) {
      const sortColumn = sortColumnMapping[sortBy] || invoices.createdAt;
      const cursorVal = cursorInvoice[sortBy as keyof typeof cursorInvoice];

      const val = cursorVal as string | number | Date;

      if (sortOrder === "desc") {
        whereConditions.push(
          or(
            lt(sortColumn, val),
            and(eq(sortColumn, val), lt(invoices.id, cursor)),
          ),
        );
      } else {
        whereConditions.push(
          or(
            gt(sortColumn, val),
            and(eq(sortColumn, val), gt(invoices.id, cursor)),
          ),
        );
      }
    }
  }

  const sortOrderFn = sortOrder === "desc" ? desc : asc;
  const primarySort = sortColumnMapping[sortBy] || invoices.createdAt;

  const filteredConditions = whereConditions.filter(
    (c): c is SQL => c !== undefined,
  );

  const items = await db
    .select()
    .from(invoices)
    .where(and(...filteredConditions))
    .orderBy(sortOrderFn(primarySort), sortOrderFn(invoices.id))
    .limit(limit + 1);

  let nextCursor: string | null = null;
  if (items.length > limit) {
    const nextItem = items.pop();

    nextCursor = nextItem?.id || null;
  }

  return { items, nextCursor };
}

export async function deleteInvoice(id: string, userId: string): Promise<void> {
  await db
    .update(invoices)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(invoices.id, id), eq(invoices.userId, userId)));
}
