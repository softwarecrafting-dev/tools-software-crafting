import * as z from "zod";

export const InvoiceStatusEnum = z.enum([
  "draft",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "cancelled",
]);

export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;

export const InvoiceLineItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  description: z.string().min(1, "Description is required").max(500),
  quantity: z.number().positive("Quantity must be positive").max(99999),
  unit: z.enum(["hrs", "days", "units", "months", "project", "custom"]),
  rate: z.number().nonnegative("Rate must be non-negative").max(9999999.99),
  amount: z.number().nonnegative(),
  type: z.enum(["item", "section"]).default("item"),
});

export type InvoiceLineItemInput = z.infer<typeof InvoiceLineItemSchema>;

export const InvoiceBaseSchema = z.object({
  clientName: z.string().min(1, "Client name is required").max(255),
  clientEmail: z.email("Invalid client email").max(255),
  clientCompany: z.string().max(255).optional().nullable(),
  clientAddress: z.string().max(1000).optional().nullable(),
  clientGstin: z.string().max(20).optional().nullable(),
  poNumber: z.string().max(100).optional().nullable(),
  invoiceNumber: z.string().min(1, "Invoice number is required").max(50),
  currency: z.enum(["INR", "USD", "GBP", "EUR", "AED"]).default("INR"),
  issueDate: z.iso.datetime(),
  dueDate: z.iso.datetime(),
  lineItems: z
    .array(InvoiceLineItemSchema)
    .min(1, "At least one line item is required"),
  taxRate: z.number().min(0).max(100),
  discountType: z.enum(["percentage", "fixed"]).nullable().optional(),
  discountValue: z.number().nonnegative().default(0),
  notes: z.string().max(2000).optional().nullable(),
  terms: z.string().max(2000).optional().nullable(),
});

export const InvoiceCreateSchema = InvoiceBaseSchema.refine(
  (data) => new Date(data.dueDate) >= new Date(data.issueDate),
  {
    message: "Due date cannot be before issue date",
    path: ["dueDate"],
  },
);

export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;

export const InvoiceUpdateSchema = InvoiceBaseSchema.partial();
export type InvoiceUpdateInput = z.infer<typeof InvoiceUpdateSchema>;

export const InvoiceFiltersSchema = z.object({
  cursor: z.uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(25),
  status: InvoiceStatusEnum.optional(),
  search: z.string().max(100).optional(),
  sortBy: z
    .enum(["created_at", "updated_at", "total", "status", "due_date"])
    .default("created_at"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  fromDate: z.iso.datetime().optional(),
  toDate: z.iso.datetime().optional(),
});

export type InvoiceFiltersInput = z.infer<typeof InvoiceFiltersSchema>;
export type InvoiceFiltersQuery = z.input<typeof InvoiceFiltersSchema>;
