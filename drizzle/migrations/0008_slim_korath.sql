ALTER TABLE "invoices" ADD COLUMN "template" text DEFAULT 'minimal';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_terms_days" integer;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "tax_label" text DEFAULT 'Tax';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "viewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paid_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "reminder_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "attachments" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "send_to_email" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "send_cc_emails" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "public_token" text;--> statement-breakpoint
ALTER TABLE "user_settings" ADD COLUMN "swift_bic" text;--> statement-breakpoint
CREATE INDEX "idx_invoices_public_token" ON "invoices" USING btree ("public_token");--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_public_token_unique" UNIQUE("public_token");