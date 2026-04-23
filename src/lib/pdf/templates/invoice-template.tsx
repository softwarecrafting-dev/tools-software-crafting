import type { InvoiceRecord } from "@/lib/db/repositories/types";
import type { InvoiceLineItemInput } from "@/lib/validators/invoice";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b", // slate-800
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  fromSection: {
    maxWidth: "60%",
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerRight: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "light",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  grid: {
    flexDirection: "row",
    marginBottom: 40,
    gap: 40,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: 4,
    letterSpacing: 1,
  },
  value: {
    fontSize: 10,
    marginBottom: 2,
  },
  clientName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  table: {
    marginTop: 20,
    flex: 1,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
    paddingVertical: 8,
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colRate: { flex: 1.5, textAlign: "right" },
  colAmount: { flex: 1.5, textAlign: "right", fontWeight: "bold" },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    alignItems: "flex-end",
  },
  leftFooter: {
    maxWidth: "50%",
  },
  totals: {
    width: 200,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalLabel: {
    color: "#94a3b8",
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#94a3b8",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
  },
  notesSection: {
    marginTop: 20,
  },
});

function formatCurrency(amount: string | number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(Number(amount));
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "-";

  return format(new Date(date), "MMM dd, yyyy");
}

export function InvoiceDocument({ invoice }: { invoice: InvoiceRecord }) {
  const lineItems = (invoice.lineItems as InvoiceLineItemInput[]) || [];

  return (
    <Document title={`Invoice-${invoice.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.fromSection}>
            <Text style={styles.businessName}>{invoice.fromName}</Text>
            <Text style={styles.value}>{invoice.fromAddress}</Text>
            <Text style={styles.value}>{invoice.fromEmail}</Text>
            {invoice.fromGstin && (
              <Text style={styles.value}>GSTIN: {invoice.fromGstin}</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.column}>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.clientName}>{invoice.clientName}</Text>
            {invoice.clientCompany && (
              <Text style={styles.value}>{invoice.clientCompany}</Text>
            )}
            <Text style={styles.value}>{invoice.clientAddress}</Text>
          </View>
          <View style={styles.column}>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <View>
                <Text style={styles.label}>Date issued</Text>
                <Text style={styles.value}>
                  {formatDate(invoice.issueDate)}
                </Text>
              </View>
              <View>
                <Text style={styles.label}>Due Date</Text>
                <Text style={styles.value}>{formatDate(invoice.dueDate)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.label, styles.colDesc]}>Description</Text>
            <Text style={[styles.label, styles.colQty]}>Qty</Text>
            <Text style={[styles.label, styles.colRate]}>Rate</Text>
            <Text style={[styles.label, styles.colAmount]}>Amount</Text>
          </View>

          {lineItems.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                {item.description && (
                  <Text style={{ fontSize: 8, color: "#64748b", marginTop: 2 }}>
                    {item.description}
                  </Text>
                )}
              </View>
              <Text style={styles.colQty}>
                {item.quantity} {item.unit}
              </Text>
              <Text style={styles.colRate}>
                {formatCurrency(item.rate, invoice.currency)}
              </Text>
              <Text style={styles.colAmount}>
                {formatCurrency(item.amount, invoice.currency)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsContainer}>
          <View style={styles.leftFooter}>
            {invoice.notes && (
              <View style={styles.notesSection}>
                <Text style={styles.label}>Notes</Text>
                <Text
                  style={{ fontSize: 8, color: "#64748b", lineHeight: 1.5 }}
                >
                  {invoice.notes}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text>{formatCurrency(invoice.subtotal, invoice.currency)}</Text>
            </View>

            {Number(invoice.discountAmount) > 0 && (
              <View style={styles.totalRow}>
                <Text style={{ color: "#ef4444" }}>Discount</Text>
                <Text style={{ color: "#ef4444" }}>
                  -{formatCurrency(invoice.discountAmount, invoice.currency)}
                </Text>
              </View>
            )}

            {Number(invoice.taxAmount) > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {invoice.taxLabel || "Tax"} ({invoice.taxRate}%)
                </Text>
                <Text>
                  {formatCurrency(invoice.taxAmount, invoice.currency)}
                </Text>
              </View>
            )}

            <View style={styles.grandTotal}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                {formatCurrency(invoice.total, invoice.currency)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
