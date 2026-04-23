import type { InvoiceRecord } from "@/lib/db/repositories/types";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "./templates/invoice-template";

export async function renderInvoiceToBuffer(
  invoice: InvoiceRecord,
): Promise<Buffer> {
  return await renderToBuffer(<InvoiceDocument invoice={invoice} />);
}
