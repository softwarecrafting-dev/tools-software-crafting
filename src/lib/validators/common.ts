import { z } from "zod";

export const IdParamSchema = z.object({
  id: z.uuid("Invalid ID format"),
});

export type IdParamInput = z.infer<typeof IdParamSchema>;
