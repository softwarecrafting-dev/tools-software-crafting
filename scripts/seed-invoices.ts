import { eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import type { NewInvoice } from "../src/lib/db/repositories/types";
import { invoices, users } from "../src/lib/db/schema";

async function seed() {
  console.log("Seeding invoices...");

  const email = "badal@softwarecrafting.in";
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    console.error("No user found. Please register a user first.");
    process.exit(1);
  }

  console.log(`Seeding for user: ${user.email} (${user.id})`);

  const statuses = [
    "draft",
    "pending",
    "paid",
    "overdue",
    "cancelled",
  ] as const;
  const clients = [
    { name: "Acme Corp", email: "billing@acme.com" },
    { name: "Globex Corporation", email: "finance@globex.com" },
    { name: "Soylent Corp", email: "accounts@soylent.com" },
    { name: "Initech", email: "billing@initech.com" },
    { name: "Wayne Enterprises", email: "finance@wayne.com" },
  ];

  const invoiceRecords: NewInvoice[] = [];

  for (let i = 1; i <= 100; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;
    const total = parseFloat((Math.random() * 5000 + 100).toFixed(2));

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180));
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);

    invoiceRecords.push({
      userId: user.id,
      invoiceNumber: `INV-2024-${String(i).padStart(4, "0")}`,
      clientName: client.name,
      clientEmail: client.email,
      status: status,
      currency: "USD",
      total: total.toFixed(2),
      subtotal: (total * 0.82).toFixed(2),
      taxRate: "18.00",
      taxAmount: (total * 0.18).toFixed(2),
      issueDate: date,
      dueDate: dueDate,
      lineItems: [
        {
          id: crypto.randomUUID(),
          description: "Software Services",
          quantity: 1,
          unitPrice: (total * 0.82).toFixed(2),
          total: (total * 0.82).toFixed(2),
        },
      ],
      createdAt: date,
      updatedAt: date,
    });
  }

  for (let i = 0; i < invoiceRecords.length; i += 20) {
    const batch = invoiceRecords.slice(i, i + 20);
    await db.insert(invoices).values(batch);
    console.log(`Inserted batch ${i / 20 + 1}`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
