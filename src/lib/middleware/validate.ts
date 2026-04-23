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

export async function parseQuery<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  const url = new URL(request.url);
  const raw = Object.fromEntries(url.searchParams.entries());

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

export async function parseFormData<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<T> {
  const formData = await request.formData().catch(() => {
    throw new ValidationError([
      { field: "file", message: "Invalid form data" },
    ]);
  });

  const raw = Object.fromEntries(formData.entries());
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

export async function parseParams<T>(
  params: Promise<unknown> | unknown,
  schema: ZodSchema<T>,
): Promise<T> {
  const resolvedParams = await (params instanceof Promise ? params : Promise.resolve(params));
  const result = schema.safeParse(resolvedParams);

  if (!result.success) {
    const details = result.error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    throw new ValidationError(details);
  }

  return result.data;
}
