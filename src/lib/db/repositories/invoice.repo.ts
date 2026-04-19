import { db } from "@/lib/db/client";
import { invoices } from "@/lib/db/schema";
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

export async function createInvoice(data: NewInvoice): Promise<InvoiceRecord> {
  const [invoice] = await db.insert(invoices).values(data).returning();

  return invoice;
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
    sortBy = "created_at",
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
    whereConditions.push(
      or(
        ilike(invoices.clientName, `%${search}%`),
        ilike(invoices.invoiceNumber, `%${search}%`),
      ),
    );
  }

  if (fromDate) {
    whereConditions.push(gte(invoices.issueDate, new Date(fromDate)));
  }

  if (toDate) {
    whereConditions.push(lte(invoices.issueDate, new Date(toDate)));
  }

  if (cursor) {
    const cursorInvoice = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, cursor), eq(invoices.userId, userId)))
      .limit(1)
      .then((res) => res[0]);

    if (cursorInvoice) {
      const sortColumnMapping: Record<string, PgColumn> = {
        created_at: invoices.createdAt,
        updated_at: invoices.updatedAt,
        total: invoices.total,
        status: invoices.status,
        due_date: invoices.dueDate,
      };

      const sortColumn = sortColumnMapping[sortBy] || invoices.createdAt;

      const cursorVal =
        sortBy === "created_at"
          ? cursorInvoice.createdAt
          : sortBy === "updated_at"
            ? cursorInvoice.updatedAt
            : sortBy === "total"
              ? cursorInvoice.total
              : sortBy === "status"
                ? cursorInvoice.status
                : sortBy === "due_date"
                  ? cursorInvoice.dueDate
                  : cursorInvoice.createdAt;

      if (sortOrder === "desc") {
        whereConditions.push(
          or(
            lt(sortColumn, cursorVal),
            and(eq(sortColumn, cursorVal), lt(invoices.id, cursor)),
          ),
        );
      } else {
        whereConditions.push(
          or(
            gt(sortColumn, cursorVal),
            and(eq(sortColumn, cursorVal), gt(invoices.id, cursor)),
          ),
        );
      }
    }
  }

  const sortOrderFn = sortOrder === "desc" ? desc : asc;
  const sortColumnMapping: Record<string, PgColumn> = {
    created_at: invoices.createdAt,
    updated_at: invoices.updatedAt,
    total: invoices.total,
    status: invoices.status,
    due_date: invoices.dueDate,
  };

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
