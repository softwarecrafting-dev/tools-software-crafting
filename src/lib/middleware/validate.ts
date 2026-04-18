import type { ZodSchema } from "zod";

export class ValidationError extends Error {
  details: { field: string; message: string }[];

  constructor(details: { field: string; message: string }[]) {
    super("Validation failed");
    this.name = "ValidationError";
    this.details = details;
  }
}

export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  const raw = await request.json().catch(() => {
    throw new ValidationError([{ field: "body", message: "Invalid JSON" }]);
  });

  const result = schema.safeParse(raw);

  if (!result.success) {
    const details = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    throw new ValidationError(details);
  }

  return result.data;
}
