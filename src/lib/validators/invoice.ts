import * as z from "zod";

export const InvoiceStatusEnum = z.enum([
  "draft",
  "pending",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "cancelled",
]);

export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;

export const InvoiceLineItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Item name is required").max(255),
  description: z.string().max(500).optional().nullable(),
  quantity: z.number().positive("Quantity must be positive").max(99999),
  unit: z.enum(["hrs", "days", "pages", "words", "units", "fixed", "months"]),
  rate: z.number().nonnegative("Rate must be non-negative").max(9999999.99),
  amount: z.number().nonnegative(),
});

export type InvoiceLineItemInput = z.infer<typeof InvoiceLineItemSchema>;

export const InvoiceBaseSchema = z
  .object({
    id: z.string().optional().nullable(),
    clientName: z.string().trim().min(1, "Client name is required").max(255),
    clientEmail: z.email("Invalid client email").max(255).trim(),
    clientCompany: z.string().max(255).optional().nullable(),
    clientAddress: z.string().max(1000).optional().nullable(),
    clientGstin: z.string().max(20).optional().nullable(),
    poNumber: z.string().max(100).optional().nullable(),
    invoiceNumber: z
      .string()
      .trim()
      .min(1, "Invoice number is required")
      .max(50),
    currency: z.enum(["INR", "USD", "GBP", "EUR", "AED", "SGD"]).default("INR"),
    issueDate: z.iso.datetime(),
    dueDate: z.iso.datetime(),
    lineItems: z
      .array(InvoiceLineItemSchema)
      .min(1, "At least one line item is required"),
    taxRate: z.number().min(0).max(100).default(0),
    taxAmount: z.number().nonnegative().default(0),
    discountType: z.enum(["percentage", "fixed"]).nullable().optional(),
    discountValue: z.number().nonnegative().default(0),
    discountAmount: z.number().nonnegative().default(0),
    subtotal: z.number().nonnegative().default(0),
    total: z.number().nonnegative().default(0),
    template: z.enum(["minimal", "classic", "modern"]).default("minimal"),
    paymentTermsDays: z.number().int().nonnegative().optional().nullable(),
    taxLabel: z.string().max(50).default("Tax"),
    attachments: z
      .array(
        z.object({
          id: z.uuid(),
          name: z.string(),
          url: z.url(),
          size: z.number(),
          type: z.string(),
        }),
      )
      .default([]),
    sendToEmail: z.email().optional().nullable(),
    sendCcEmails: z.array(z.email()).default([]),
    publicToken: z.string().optional().nullable(),
    notes: z.string().max(2000).optional().nullable(),
    terms: z.string().max(2000).optional().nullable(),
    fromName: z.string().max(255).optional().nullable(),
    fromEmail: z.string().max(255).optional().nullable(),
    fromPhone: z.string().max(50).optional().nullable(),
    fromAddress: z.string().max(1000).optional().nullable(),
    fromGstin: z.string().max(20).optional().nullable(),
    fromPan: z.string().max(20).optional().nullable(),
    bankName: z.string().max(255).optional().nullable(),
    accountName: z.string().max(255).optional().nullable(),
    accountNumber: z.string().max(50).optional().nullable(),
    ifscCode: z.string().max(20).optional().nullable(),
    upiId: z.string().max(255).optional().nullable(),
    swiftBic: z.string().max(20).optional().nullable(),
    logoUrl: z.url().optional().nullable(),
    signatureUrl: z.url().optional().nullable(),
    status: InvoiceStatusEnum.optional(),
  })
  .strict();

export const InvoiceCreateSchema = InvoiceBaseSchema.refine(
  (data) => new Date(data.dueDate) >= new Date(data.issueDate),
  {
    message: "Due date cannot be before issue date",
    path: ["dueDate"],
  },
);

export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;

export const InvoiceUpdateSchema = InvoiceBaseSchema.partial().strict();
export type InvoiceUpdateInput = z.infer<typeof InvoiceUpdateSchema>;

export const InvoiceFiltersSchema = z.object({
  cursor: z.uuid().optional(),
  limit: z.coerce.number().min(1).max(100).default(25),
  status: InvoiceStatusEnum.optional(),
  search: z.string().max(100).optional(),
  sortBy: z
    .enum([
      "invoiceNumber",
      "clientName",
      "status",
      "issueDate",
      "dueDate",
      "total",
      "createdAt",
      "updatedAt",
    ])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  fromDate: z.iso.datetime().optional(),
  toDate: z.iso.datetime().optional(),
});

export type InvoiceFiltersInput = z.infer<typeof InvoiceFiltersSchema>;

export const InvoiceSendSchema = z.object({
  toEmail: z.email("Invalid recipient email"),
  subject: z.string().max(255).optional(),
  message: z.string().max(2000).optional(),
  attachPdf: z.boolean().default(true),
});

export type InvoiceSendInput = z.infer<typeof InvoiceSendSchema>;
export type InvoiceFiltersQuery = z.input<typeof InvoiceFiltersSchema>;
