ALTER TABLE "invoices" DROP CONSTRAINT "invoices_public_token_unique";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "payment_terms_days";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "template";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "tax_label";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "attachments";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "public_token";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "sent_at";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "viewed_at";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "paid_at";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "reminder_sent_at";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "send_to_email";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "send_cc_emails";--> statement-breakpoint
ALTER TABLE "user_settings" DROP COLUMN "swift_bic";