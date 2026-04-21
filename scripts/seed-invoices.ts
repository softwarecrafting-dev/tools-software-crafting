import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db/client";
import { create, getNextNumber } from "../src/lib/db/repositories/invoice.repo";
import { users, userSettings } from "../src/lib/db/schema";

async function seed() {
  console.log("Seeding invoices...");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, "badal@softwarecrafting.in"))
    .limit(1);
  if (!user) {
    console.error("User badal@softwarecrafting.in not found.");

    process.exit(1);
  }

  console.log(`Seeding for user: ${user.email} (${user.id})`);

  let [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, user.id))
    .limit(1);

  if (!settings) {
    console.log("Creating default user settings...");

    [settings] = await db
      .insert(userSettings)
      .values({
        userId: user.id,
        businessName: faker.company.name(),
        businessEmail: user.email,
        businessAddress: faker.location.streetAddress({ useFullAddress: true }),
        invoicePrefix: "INV",
      })
      .returning();
  }

  const currency = settings?.defaultCurrency ?? "USD";
  console.log(`Using currency: ${currency}`);

  const count = 100;
  for (let i = 0; i < count; i++) {
    const nextNum = await getNextNumber(user.id);
    const lineItemCount = faker.number.int({ min: 1, max: 5 });
    const lineItems = [];
    let subtotalIdx = 0;

    for (let j = 0; j < lineItemCount; j++) {
      const qty = faker.number.int({ min: 1, max: 10 });
      const rate = faker.number.int({ min: 100, max: 5000 });
      const amount = qty * rate;
      subtotalIdx += amount;

      lineItems.push({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        quantity: qty,
        unit: faker.helpers.arrayElement(["hrs", "days", "units"]),
        rate: rate,
        amount: amount,
      });
    }

    const taxRate = faker.helpers.arrayElement([0, 5, 12, 18]);
    const discountType = faker.helpers.arrayElement([
      "percentage",
      "fixed",
      null,
    ]);
    let discountValue = 0;
    let discountAmount = 0;

    if (discountType === "percentage") {
      discountValue = faker.number.int({ min: 5, max: 15 });
      discountAmount = (subtotalIdx * discountValue) / 100;
    } else if (discountType === "fixed") {
      discountValue = faker.number.int({ min: 50, max: 500 });
      discountAmount = discountValue;
    }

    const taxableAmount = subtotalIdx - discountAmount;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const total = taxableAmount + taxAmount;

    const issueDate = faker.date.past({ years: 1 });
    const dueDate = new Date(issueDate);
    dueDate.setDate(
      dueDate.getDate() + faker.helpers.arrayElement([7, 14, 30]),
    );

    const status = faker.helpers.arrayElement([
      "draft",
      "sent",
      "viewed",
      "paid",
      "overdue",
    ]);

    await create({
      userId: user.id,
      invoiceNumber: nextNum,
      clientName: faker.company.name(),
      clientEmail: faker.internet.email(),
      clientCompany: faker.company.name(),
      clientAddress: faker.location.streetAddress({ useFullAddress: true }),
      clientGstin: faker.helpers.replaceSymbols("29AAAAA0000A1Z5"),
      currency: currency,
      issueDate: issueDate,
      dueDate: dueDate,
      lineItems: lineItems,
      subtotal: subtotalIdx.toFixed(2),
      taxRate: taxRate.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      discountType: discountType,
      discountValue: discountValue.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      total: total.toFixed(2),
      status: status,
      notes: faker.lorem.sentence(),
      terms: faker.lorem.paragraph(),
      template: faker.helpers.arrayElement(["minimal", "classic", "modern"]),
      taxLabel: "Tax",
    });

    console.log(`Seeded invoice ${nextNum}`);
  }

  console.log(`Successfully seeded ${count} invoices.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
