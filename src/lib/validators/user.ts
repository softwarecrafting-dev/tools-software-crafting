import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z
      .email("Enter a valid email address")
      .max(255, "Email must be at most 255 characters"),
    password: z
      .string()
      .min(4, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must be at most 128 characters"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
