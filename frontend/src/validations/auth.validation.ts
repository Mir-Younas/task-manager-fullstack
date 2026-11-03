import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine((email) => z.email().safeParse(email).success, {
    message: "Please enter a valid email address",
  });

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password cannot exceed 64 characters")
  .refine(
    (password) =>
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password),
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),

    email: emailSchema,

    password: strongPasswordSchema,

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
