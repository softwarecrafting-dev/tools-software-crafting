CREATE TABLE "user_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"business_name" text,
	"business_address" text,
	"business_email" text,
	"business_phone" text,
	"gstin" text,
	"pan" text,
	"bank_name" text,
	"bank_account_number" text,
	"bank_ifsc" text,
	"bank_upi_id" text,
	"logo_url" text,
	"signature_url" text,
	"default_currency" text DEFAULT 'INR' NOT NULL,
	"default_tax_rate" numeric(5, 2) DEFAULT '18.00' NOT NULL,
	"invoice_prefix" text DEFAULT 'INV' NOT NULL,
	"default_payment_terms" text,
	"default_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_settings_user_id" ON "user_settings" USING btree ("user_id");