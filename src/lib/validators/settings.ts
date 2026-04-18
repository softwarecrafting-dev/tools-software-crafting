import * as z from "zod";

export const SettingsSchema = z.object({
  businessName: z
    .string()
    .min(1, "Business name is required")
    .max(255, "Business name is too long"),
  businessAddress: z
    .string()
    .min(1, "Business address is required")
    .optional()
    .or(z.literal("")),
  businessEmail: z.email("Invalid email address").optional().or(z.literal("")),
  businessPhone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  gstin: z.string().max(20, "GSTIN is too long").optional().or(z.literal("")),
  pan: z.string().max(20, "PAN is too long").optional().or(z.literal("")),
  bankName: z
    .string()
    .max(100, "Bank name is too long")
    .optional()
    .or(z.literal("")),
  bankAccountNumber: z
    .string()
    .max(50, "Account number is too long")
    .optional()
    .or(z.literal("")),
  bankIfsc: z
    .string()
    .max(20, "IFSC code is too long")
    .optional()
    .or(z.literal("")),
  bankUpiId: z
    .string()
    .max(100, "UPI ID is too long")
    .optional()
    .or(z.literal("")),
  defaultCurrency: z
    .string()
    .length(3, "Currency code must be 3 characters")
    .default("INR"),
  defaultTaxRate: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid tax rate format")
    .default("18.00"),
  invoicePrefix: z.string().max(10, "Prefix is too long").default("INV"),
  defaultPaymentTerms: z.string().optional().or(z.literal("")),
  defaultNotes: z.string().optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof SettingsSchema>;
